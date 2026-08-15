#!/usr/bin/env python3
"""Build controlled SVG stimuli for MisVis Verify.

Pure standard library. Generates:
  - 24 main SVGs (12 matched pairs) from study/data/stimuli.json
  - 4 baseline SVGs from study/data/baseline.json
  - 6 transfer SVGs from study/data/transfer.json

Neutral IDs: main S001..S024, baseline S101..S104, transfer S201..S206.
Writes study/data/stimulus_map.json and study/data/stimuli-data.js.
"""

import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DATA_PATH = os.path.join(ROOT, "study", "data", "stimuli.json")
BASE_PATH = os.path.join(ROOT, "study", "data", "baseline.json")
TRANS_PATH = os.path.join(ROOT, "study", "data", "transfer.json")
OUT_DIR = os.path.join(ROOT, "study", "assets", "stimuli")
MAP_PATH = os.path.join(ROOT, "study", "data", "stimulus_map.json")
JS_DATA_PATH = os.path.join(ROOT, "study", "data", "stimuli-data.js")

W = 1200
H = 720

PAPER = "#ffffff"
INK = "#10202b"
MUTED = "#63717d"
ACCENT = "#ef6a55"
BLUE = "#4f7899"
GREEN = "#71977b"
GOLD = "#efc46b"
LINE = "#d9ddd8"
GRID = "#eef0ef"
BAND = "#dbe4ec"

FONT = "Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif"

ML = 90
MR = 50
MT = 140
MB = 90

CW = W - ML - MR
CH = H - MT - MB
CX0 = ML
CX1 = W - MR
CY0 = MT
CY1 = H - MB


def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;")
            .replace(">", "&gt;").replace('"', "&quot;"))


def text(x, y, content, size=24, fill=INK, anchor="start", weight="normal"):
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-family="{FONT}" font-size="{size}" '
            f'fill="{fill}" text-anchor="{anchor}" font-weight="{weight}">{esc(content)}</text>')


def rect(x, y, w, h, fill, rx=0):
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" fill="{fill}" rx="{rx}"/>'


def line(x1, y1, x2, y2, stroke=LINE, width=2):
    return (f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
            f'stroke="{stroke}" stroke-width="{width}"/>')


def circle(cx, cy, r, fill, stroke=None, sw=2):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="{fill}"{s}/>'


def polyline(points, stroke, width=3, fill="none"):
    pts = " ".join(f"{x:.1f},{y:.1f}" for x, y in points)
    return (f'<polyline points="{pts}" fill="{fill}" stroke="{stroke}" '
            f'stroke-width="{width}" stroke-linejoin="round" stroke-linecap="round"/>')


def polygon(points, fill, stroke=None, sw=1):
    pts = " ".join(f"{x:.1f},{y:.1f}" for x, y in points)
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return f'<polygon points="{pts}" fill="{fill}"{s}/>'


def path(d, fill, stroke=None, sw=1):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return f'<path d="{d}" fill="{fill}"{s}/>'


def nice_ticks(lo, hi, n=5):
    if hi <= lo:
        hi = lo + 1
    span = hi - lo
    step_raw = span / n
    mag = 10 ** math.floor(math.log10(step_raw))
    for m in (1, 2, 2.5, 5, 10):
        if step_raw <= m * mag:
            step = m * mag
            break
    else:
        step = 10 * mag
    start = math.ceil(lo / step) * step
    ticks = []
    v = start
    while v <= hi + 1e-9:
        ticks.append(v)
        v += step
    return ticks


def fmt(v):
    if abs(v - round(v)) < 1e-9:
        return str(int(round(v)))
    return f"{v:.1f}"


class Chart:
    def __init__(self, title):
        self.parts = []
        self.title = title
        self.parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">')
        self.parts.append(rect(0, 0, W, H, PAPER))
        self.parts.append(text(W / 2, 58, title, size=30, anchor="middle", weight="bold"))

    def add(self, s):
        self.parts.append(s)

    def render(self):
        self.parts.append("</svg>")
        return "\n".join(self.parts)


def draw_axis_frame(c, y_min, y_max, x_labels, x_positions):
    yscale = lambda v: CY1 - (v - y_min) / (y_max - y_min) * CH
    for tick in nice_ticks(y_min, y_max):
        y = yscale(tick)
        c.add(line(CX0, y, CX1, y, GRID, 1))
        c.add(line(CX0, y, CX0 - 6, y, LINE, 2))
        c.add(text(CX0 - 12, y + 8, fmt(tick), size=20, fill=MUTED, anchor="end"))
    c.add(line(CX0, CY1, CX1, CY1, INK, 2))
    c.add(line(CX0, CY0, CX0, CY1, INK, 2))
    for x, label in zip(x_positions, x_labels):
        c.add(text(x, CY1 + 44, label, size=22, fill=INK, anchor="middle"))
    return yscale


def draw_bar_chart(c, categories, values, y_min, y_max, y_label,
                   highlight_index=None, value_labels=True):
    n = len(categories)
    slot = CW / n
    bar_w = slot * 0.5
    yscale = draw_axis_frame(c, y_min, y_max, categories,
                             [CX0 + slot * (i + 0.5) for i in range(n)])
    c.add(text(CX0 - 20, CY0 - 20, y_label, size=20, fill=MUTED, anchor="start"))
    for i, v in enumerate(values):
        x = CX0 + slot * i + (slot - bar_w) / 2
        y = yscale(v)
        color = ACCENT if (highlight_index is not None and i == highlight_index) else BLUE
        c.add(rect(x, y, bar_w, CY1 - y, color, rx=8))
        if value_labels:
            c.add(text(x + bar_w / 2, y - 14, fmt(v), size=24, fill=INK, anchor="middle", weight="bold"))


def draw_line_chart(c, x_labels, series_list, y_min, y_max, y_label, legend=True):
    n = len(x_labels)
    xpos = [CX0 + CW * i / (n - 1) for i in range(n)]
    yscale = draw_axis_frame(c, y_min, y_max, x_labels, xpos)
    c.add(text(CX0 - 20, CY0 - 20, y_label, size=20, fill=MUTED, anchor="start"))

    if legend:
        lx = CX1
        ly = CY0 + 6
        for s in series_list:
            c.add(text(lx, ly, s["label"], size=20, fill=s["color"], anchor="end"))
            ly += 30

    for s in series_list:
        pts = [(xpos[i], yscale(s["values"][i])) for i in range(n)]
        c.add(polyline(pts, s["color"], 3))
        for x, y in pts:
            c.add(circle(x, y, 5, s["color"]))


def draw_uncertainty_chart(c, x_labels, hist_values, forecast_values,
                           halfwidth, y_min, y_max, y_label, show_band):
    n = len(x_labels)
    xpos = [CX0 + CW * i / (n - 1) for i in range(n)]
    yscale = draw_axis_frame(c, y_min, y_max, x_labels, xpos)
    c.add(text(CX0 - 20, CY0 - 20, y_label, size=20, fill=MUTED, anchor="start"))

    nh = len(hist_values)

    if show_band:
        band_points = []
        for i in range(nh, n):
            band_points.append((xpos[i], yscale(forecast_values[i - nh] + halfwidth[i - nh])))
        for i in range(n - 1, nh - 1, -1):
            band_points.append((xpos[i], yscale(forecast_values[i - nh] - halfwidth[i - nh])))
        c.add(polygon(band_points, BAND))

    hist_pts = [(xpos[i], yscale(hist_values[i])) for i in range(nh)]
    c.add(polyline(hist_pts, BLUE, 3))
    for x, y in hist_pts:
        c.add(circle(x, y, 5, BLUE))

    fore_pts = [(xpos[i], yscale(forecast_values[i - nh])) for i in range(nh, n)]
    c.add(polyline(fore_pts, ACCENT, 3))
    for x, y in fore_pts:
        c.add(circle(x, y, 5, ACCENT))

    c.add(text(CX1, CY0 + 6, "历史数据", size=20, fill=BLUE, anchor="end"))
    c.add(text(CX1, CY0 + 36, "预测值", size=20, fill=ACCENT, anchor="end"))


def draw_bubble_chart(c, categories, values, unit, radius_by_value):
    max_v = max(values)
    n = len(categories)
    slot = CW / n
    centers = [CX0 + slot * (i + 0.5) for i in range(n)]
    cy = (CY0 + CY1) / 2 + 30
    c.add(line(CX0, CY1, CX1, CY1, INK, 2))
    max_r = min(slot * 0.42, CH * 0.42)
    for i, v in enumerate(values):
        r = max_r * (v / max_v) if radius_by_value else max_r * math.sqrt(v / max_v)
        c.add(circle(centers[i], cy, r, BLUE, None))
        c.add(text(centers[i], cy + r + 40, categories[i], size=22, fill=INK, anchor="middle"))
        if r >= 30:
            c.add(text(centers[i], cy + 8, fmt(v), size=24, fill="#ffffff", anchor="middle", weight="bold"))
        else:
            c.add(text(centers[i], cy - r - 16, fmt(v), size=22, fill=INK, anchor="middle", weight="bold"))
    c.add(text(W / 2, CY1 - 8, f"单位：{unit}", size=18, fill=MUTED, anchor="middle"))


def draw_dual_axis(c, x_labels, left_values, right_values,
                   left_min, left_max, right_min, right_max,
                   left_label, right_label):
    n = len(x_labels)
    xpos = [CX0 + CW * i / (n - 1) for i in range(n)]

    left_scale = lambda v: CY1 - (v - left_min) / (left_max - left_min) * CH
    right_scale = lambda v: CY1 - (v - right_min) / (right_max - right_min) * CH

    # left axis
    c.add(line(CX0, CY0, CX0, CY1, INK, 2))
    for tick in nice_ticks(left_min, left_max):
        y = left_scale(tick)
        c.add(line(CX0, y, CX0 - 6, y, LINE, 2))
        c.add(text(CX0 - 12, y + 8, fmt(tick), size=20, fill=MUTED, anchor="end"))
    c.add(text(CX0 - 24, CY0 - 24, left_label, size=20, fill=BLUE, anchor="start"))

    # right axis
    c.add(line(CX1, CY0, CX1, CY1, INK, 2))
    for tick in nice_ticks(right_min, right_max):
        y = right_scale(tick)
        c.add(line(CX1, y, CX1 + 6, y, LINE, 2))
        c.add(text(CX1 + 12, y + 8, fmt(tick), size=20, fill=MUTED, anchor="start"))
    c.add(text(CX1 + 12, CY0 - 24, right_label, size=20, fill=ACCENT, anchor="end"))

    # bottom axis + x labels
    c.add(line(CX0, CY1, CX1, CY1, INK, 2))
    for x, label in zip(xpos, x_labels):
        c.add(text(x, CY1 + 44, label, size=22, fill=INK, anchor="middle"))

    # left series line (blue)
    lp = [(xpos[i], left_scale(left_values[i])) for i in range(n)]
    c.add(polyline(lp, BLUE, 3))
    for x, y in lp:
        c.add(circle(x, y, 5, BLUE))

    # right series line (accent)
    rp = [(xpos[i], right_scale(right_values[i])) for i in range(n)]
    c.add(polyline(rp, ACCENT, 3))
    for x, y in rp:
        c.add(circle(x, y, 5, ACCENT))

    # legend
    c.add(text(CX1, CY0 + 6, left_label, size=20, fill=BLUE, anchor="end"))
    c.add(text(CX1, CY0 + 36, right_label, size=20, fill=ACCENT, anchor="end"))


def pie_slice_path(cx, cy, r, a1, a2):
    x1 = cx + r * math.sin(a1)
    y1 = cy - r * math.cos(a1)
    x2 = cx + r * math.sin(a2)
    y2 = cy - r * math.cos(a2)
    large = 1 if (a2 - a1) > math.pi else 0
    return (f"M {cx:.1f} {cy:.1f} L {x1:.1f} {y1:.1f} "
            f"A {r:.1f} {r:.1f} 0 {large} 1 {x2:.1f} {y2:.1f} Z")


def draw_pie(c, slices):
    PALETTE = [BLUE, GREEN, GOLD, "#b9c2c8"]
    total = sum(s["value"] for s in slices)
    cx = CX0 + CW / 2
    cy = CY0 + CH / 2
    r = min(CW, CH) * 0.38

    a = -math.pi / 2  # start at top
    for i, s in enumerate(slices):
        frac = s["value"] / total
        a1 = a
        a2 = a + frac * 2 * math.pi
        c.add(path(pie_slice_path(cx, cy, r, a1, a2), PALETTE[i % len(PALETTE)],
                   stroke=PAPER, sw=2))
        mid = (a1 + a2) / 2
        lx = cx + (r * 0.62) * math.sin(mid)
        ly = cy - (r * 0.62) * math.cos(mid)
        c.add(text(lx, ly, f"{s['value']}%", size=26, fill="#ffffff",
                   anchor="middle", weight="bold"))
        a = a2

    # legend
    lx = cx + r + 70
    ly = cy - (len(slices) - 1) * 22
    for i, s in enumerate(slices):
        c.add(rect(lx, ly - 16, 22, 22, PALETTE[i % len(PALETTE)], rx=4))
        c.add(text(lx + 34, ly + 4, f"{s['label']} {s['value']}%", size=22, fill=INK, anchor="start"))
        ly += 44


# ---------------------------------------------------------------
# Trial rendering (for baseline/transfer)
# ---------------------------------------------------------------
def render_trial(mechanism, data, title):
    c = Chart(title)

    if mechanism == "truncated-axis":
        draw_bar_chart(c, data["categories"], data["values"],
                       data["yMin"], data["yMax"], data["yLabel"])

    elif mechanism == "cherry-picked-time":
        series = [{"label": data["yLabel"], "values": data["values"], "color": BLUE}]
        y_min = min(data["values"]) * 0.8
        y_max = max(data["values"]) * 1.1
        draw_line_chart(c, [str(y) for y in data["years"]], series,
                        y_min, y_max, data["yLabel"], legend=False)

    elif mechanism == "hidden-uncertainty":
        all_years = data["histYears"] + data["forecastYears"]
        y_min = 0
        y_max = max(v + h for v, h in zip(data["forecastValues"], data["uncertaintyHalfwidth"])) * 1.1
        draw_uncertainty_chart(c, [str(y) for y in all_years],
                               data["histValues"], data["forecastValues"],
                               data["uncertaintyHalfwidth"], y_min, y_max,
                               data["yLabel"], show_band=data.get("showBand", True))

    elif mechanism == "area-distortion":
        draw_bubble_chart(c, data["categories"], data["values"], data["unit"],
                          radius_by_value=data.get("radiusByValue", False))

    elif mechanism == "color-emphasis":
        y_min = min(data["values"]) * 0.85
        y_max = max(data["values"]) * 1.05
        draw_bar_chart(c, data["categories"], data["values"],
                       y_min, y_max, data["yLabel"],
                       highlight_index=data.get("highlightIndex"))

    elif mechanism == "misleading-title":
        series1 = {"label": data["series1Label"], "values": data["series1"], "color": BLUE}
        series2 = {"label": data["series2Label"], "values": data["series2"], "color": ACCENT}
        y_min = 0
        y_max = max(max(data["series1"]), max(data["series2"])) * 1.2
        draw_line_chart(c, data["x"], [series1, series2], y_min, y_max, "数值", legend=True)

    elif mechanism == "dual-axis":
        draw_dual_axis(c, [str(x) for x in data["x"]],
                       data["leftValues"], data["rightValues"],
                       data["leftMin"], data["leftMax"],
                       data["rightMin"], data["rightMax"],
                       data["leftLabel"], data["rightLabel"])

    elif mechanism == "pie-3d":
        draw_pie(c, data["slices"])

    else:
        c.add(text(W / 2, H / 2, f"Unknown mechanism: {mechanism}", size=24,
                   fill=ACCENT, anchor="middle"))

    return c.render()


# ---------------------------------------------------------------
# Main pair rendering (from stimuli.json)
# ---------------------------------------------------------------
def render_pair(mechanism, data, accurate_title, misleading_title):
    acc = None
    mis = None

    if mechanism == "truncated-axis":
        acc = Chart(accurate_title)
        draw_bar_chart(acc, data["categories"], data["values"], 0,
                       data["yMaxAccurate"], data["yLabel"])
        mis = Chart(misleading_title)
        draw_bar_chart(mis, data["categories"], data["values"],
                       data["yMinMisleading"], data["yMaxMisleading"], data["yLabel"])

    elif mechanism == "cherry-picked-time":
        acc = Chart(accurate_title)
        acc_series = [{"label": data["yLabel"], "values": data["fullValues"], "color": BLUE}]
        draw_line_chart(acc, [str(y) for y in data["fullYears"]], acc_series,
                        min(data["fullValues"]) * 0.8, max(data["fullValues"]) * 1.1,
                        data["yLabel"], legend=False)
        mis = Chart(misleading_title)
        mis_series = [{"label": data["yLabel"], "values": data["cherryValues"], "color": BLUE}]
        draw_line_chart(mis, [str(y) for y in data["cherryYears"]], mis_series,
                        min(data["cherryValues"]) * 0.8, max(data["cherryValues"]) * 1.1,
                        data["yLabel"], legend=False)

    elif mechanism == "hidden-uncertainty":
        all_years = data["histYears"] + data["forecastYears"]
        y_min = 0
        y_max = max(v + h for v, h in zip(data["forecastValues"], data["uncertaintyHalfwidth"])) * 1.1
        acc = Chart(accurate_title)
        draw_uncertainty_chart(acc, [str(y) for y in all_years], data["histValues"],
                               data["forecastValues"], data["uncertaintyHalfwidth"],
                               y_min, y_max, data["yLabel"], show_band=True)
        mis = Chart(misleading_title)
        draw_uncertainty_chart(mis, [str(y) for y in all_years], data["histValues"],
                               data["forecastValues"], data["uncertaintyHalfwidth"],
                               y_min, y_max, data["yLabel"], show_band=False)

    elif mechanism == "area-distortion":
        acc = Chart(accurate_title)
        draw_bubble_chart(acc, data["categories"], data["values"], data["unit"],
                          radius_by_value=False)
        mis = Chart(misleading_title)
        draw_bubble_chart(mis, data["categories"], data["values"], data["unit"],
                          radius_by_value=True)

    elif mechanism == "color-emphasis":
        y_min = min(data["values"]) * 0.85
        y_max = max(data["values"]) * 1.05
        acc = Chart(accurate_title)
        draw_bar_chart(acc, data["categories"], data["values"], y_min, y_max,
                       data["yLabel"], highlight_index=None)
        mis = Chart(misleading_title)
        draw_bar_chart(mis, data["categories"], data["values"], y_min, y_max,
                       data["yLabel"], highlight_index=data["highlightIndex"])

    elif mechanism == "misleading-title":
        series1 = {"label": data["series1Label"], "values": data["series1"], "color": BLUE}
        series2 = {"label": data["series2Label"], "values": data["series2"], "color": ACCENT}
        y_min = 0
        y_max = max(max(data["series1"]), max(data["series2"])) * 1.2
        acc = Chart(accurate_title)
        draw_line_chart(acc, data["x"], [series1, series2], y_min, y_max, "数值", legend=True)
        mis = Chart(misleading_title)
        draw_line_chart(mis, data["x"], [series1, series2], y_min, y_max, "数值", legend=True)

    return acc.render(), mis.render()


def main():
    with open(DATA_PATH, encoding="utf-8") as f:
        spec = json.load(f)
    with open(BASE_PATH, encoding="utf-8") as f:
        baseline = json.load(f)
    with open(TRANS_PATH, encoding="utf-8") as f:
        transfer = json.load(f)

    os.makedirs(OUT_DIR, exist_ok=True)

    mapping = {}
    counter = 1

    # main pairs
    for pair in spec["pairs"]:
        for key in ("accurate", "misleading"):
            sid = f"S{counter:03d}.svg"
            pair[key]["image"] = sid
            counter += 1

    for pair in spec["pairs"]:
        acc_svg, mis_svg = render_pair(pair["mechanism"], pair["data"],
                                       pair["accurate"]["title"],
                                       pair["misleading"]["title"])
        with open(os.path.join(OUT_DIR, pair["accurate"]["image"]), "w", encoding="utf-8") as f:
            f.write(acc_svg)
        mapping[pair["accurate"]["image"]] = {
            "pair_id": pair["pairId"], "mechanism": pair["mechanism"], "integrity": "accurate"}
        with open(os.path.join(OUT_DIR, pair["misleading"]["image"]), "w", encoding="utf-8") as f:
            f.write(mis_svg)
        mapping[pair["misleading"]["image"]] = {
            "pair_id": pair["pairId"], "mechanism": pair["mechanism"], "integrity": "misleading"}

    # baseline trials
    for trial in baseline["trials"]:
        svg = render_trial(trial["mechanism"], trial["data"], trial["title"])
        with open(os.path.join(OUT_DIR, trial["image"]), "w", encoding="utf-8") as f:
            f.write(svg)
        mapping[trial["image"]] = {
            "trial_id": trial["trialId"], "phase": "baseline",
            "mechanism": trial["mechanism"], "integrity": trial["integrity"]}

    # transfer trials
    for trial in transfer["trials"]:
        svg = render_trial(trial["mechanism"], trial["data"], trial["title"])
        with open(os.path.join(OUT_DIR, trial["image"]), "w", encoding="utf-8") as f:
            f.write(svg)
        mapping[trial["image"]] = {
            "trial_id": trial["trialId"], "phase": "transfer",
            "transfer_type": trial["transferType"],
            "mechanism": trial["mechanism"], "integrity": trial["integrity"]}

    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(spec, f, ensure_ascii=False, indent=2)

    with open(MAP_PATH, "w", encoding="utf-8") as f:
        json.dump(mapping, f, ensure_ascii=False, indent=2)

    with open(JS_DATA_PATH, "w", encoding="utf-8") as f:
        f.write("window.MISVIS_VERIFY_STIMULI = ")
        f.write(json.dumps(spec, ensure_ascii=False, indent=2))
        f.write(";\n\nwindow.MISVIS_VERIFY_BASELINE = ")
        f.write(json.dumps(baseline, ensure_ascii=False, indent=2))
        f.write(";\n\nwindow.MISVIS_VERIFY_TRANSFER = ")
        f.write(json.dumps(transfer, ensure_ascii=False, indent=2))
        f.write(";\n\nwindow.MISVIS_VERIFY_STIMULUS_MAP = ")
        f.write(json.dumps(mapping, ensure_ascii=False, indent=2))
        f.write(";\n")

    print(f"Generated {counter - 1} main + {len(baseline['trials'])} baseline "
          f"+ {len(transfer['trials'])} transfer SVGs into {OUT_DIR}")
    print(f"Wrote mapping to {MAP_PATH}")
    print(f"Wrote JS data to {JS_DATA_PATH}")


if __name__ == "__main__":
    main()
