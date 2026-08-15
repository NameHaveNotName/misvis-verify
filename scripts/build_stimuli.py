#!/usr/bin/env python3
"""Build controlled SVG stimuli for MisVis Verify.

Pure standard library. Generates 24 SVGs (12 matched pairs) from
study/data/stimuli.json into study/assets/stimuli/ with neutral IDs
S001.svg .. S024.svg, and writes study/data/stimulus_map.json.
"""

import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DATA_PATH = os.path.join(ROOT, "study", "data", "stimuli.json")
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
LINE = "#d9ddd8"
GRID = "#eef0ef"
BAND = "#dbe4ec"

FONT = "Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif"

ML = 90    # left margin (y-axis labels)
MR = 50    # right margin
MT = 140   # top margin (title)
MB = 90    # bottom margin (x-axis labels)

CW = W - ML - MR   # chart width
CH = H - MT - MB   # chart height
CX0 = ML           # chart left
CX1 = W - MR       # chart right
CY0 = MT           # chart top
CY1 = H - MB       # chart bottom


def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;")
            .replace(">", "&gt;").replace('"', "&quot;"))


def text(x, y, content, size=24, fill=INK, anchor="start", weight="normal"):
    return (f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" '
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
    """Draw y-axis, x-axis, ticks, and gridlines."""
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
    """series_list: list of dicts {label, values, color, dashed}"""
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
    all_values = hist_values + forecast_values

    if show_band:
        # uncertainty band only over forecast portion
        band_points = []
        for i in range(nh, n):
            band_points.append((xpos[i], yscale(forecast_values[i - nh] + halfwidth[i - nh])))
        for i in range(n - 1, nh - 1, -1):
            band_points.append((xpos[i], yscale(forecast_values[i - nh] - halfwidth[i - nh])))
        c.add(polygon(band_points, BAND))

    # historical line (solid blue)
    hist_pts = [(xpos[i], yscale(hist_values[i])) for i in range(nh)]
    c.add(polyline(hist_pts, BLUE, 3))
    for x, y in hist_pts:
        c.add(circle(x, y, 5, BLUE))

    # forecast line (dashed accent)
    fore_pts = [(xpos[i], yscale(forecast_values[i - nh])) for i in range(nh, n)]
    c.add(polyline(fore_pts, ACCENT, 3))
    for x, y in fore_pts:
        c.add(circle(x, y, 5, ACCENT))

    # legend
    c.add(text(CX1, CY0 + 6, "历史数据", size=20, fill=BLUE, anchor="end"))
    c.add(text(CX1, CY0 + 36, "预测值", size=20, fill=ACCENT, anchor="end"))


def draw_bubble_chart(c, categories, values, unit, radius_proportional_to_value):
    """radius_proportional_to_value=True -> misleading (radius ~ value).
    False -> accurate (radius ~ sqrt(value))."""
    max_v = max(values)
    n = len(categories)
    slot = CW / n
    centers = [CX0 + slot * (i + 0.5) for i in range(n)]
    cy = (CY0 + CY1) / 2 + 30

    # label baseline
    c.add(line(CX0, CY1, CX1, CY1, INK, 2))

    max_r = min(slot * 0.42, CH * 0.42)
    for i, v in enumerate(values):
        if radius_proportional_to_value:
            r = max_r * (v / max_v)
        else:
            r = max_r * math.sqrt(v / max_v)
        c.add(circle(centers[i], cy, r, BLUE, None))
        c.add(text(centers[i], cy + r + 40, categories[i], size=22, fill=INK, anchor="middle"))
        if r >= 30:
            c.add(text(centers[i], cy + 8, fmt(v), size=24, fill="#ffffff", anchor="middle", weight="bold"))
        else:
            c.add(text(centers[i], cy - r - 16, fmt(v), size=22, fill=INK, anchor="middle", weight="bold"))

    c.add(text(W / 2, CY1 - 8, f"单位：{unit}", size=18, fill=MUTED, anchor="middle"))


def build_pair(pair, idx):
    """Render one pair into two SVGs. Returns list of (filename, svg_str)."""
    mech = pair["mechanism"]
    d = pair["data"]
    out = []

    # ---------- truncated axis ----------
    if mech == "truncated-axis":
        acc = Chart(pair["accurate"]["title"])
        draw_bar_chart(acc, d["categories"], d["values"],
                       0, d["yMaxAccurate"], d["yLabel"])
        out.append((pair["accurate"]["image"], acc.render()))

        mis = Chart(pair["misleading"]["title"])
        draw_bar_chart(mis, d["categories"], d["values"],
                       d["yMinMisleading"], d["yMaxMisleading"], d["yLabel"])
        out.append((pair["misleading"]["image"], mis.render()))

    # ---------- cherry-picked time ----------
    elif mech == "cherry-picked-time":
        acc = Chart(pair["accurate"]["title"])
        acc_series = [{"label": d["yLabel"], "values": d["fullValues"], "color": BLUE}]
        y_min = min(d["fullValues"]) * 0.8
        y_max = max(d["fullValues"]) * 1.1
        draw_line_chart(acc, [str(y) for y in d["fullYears"]], acc_series,
                        y_min, y_max, d["yLabel"], legend=False)
        out.append((pair["accurate"]["image"], acc.render()))

        mis = Chart(pair["misleading"]["title"])
        mis_series = [{"label": d["yLabel"], "values": d["cherryValues"], "color": BLUE}]
        y_min = min(d["cherryValues"]) * 0.8
        y_max = max(d["cherryValues"]) * 1.1
        draw_line_chart(mis, [str(y) for y in d["cherryYears"]], mis_series,
                        y_min, y_max, d["yLabel"], legend=False)
        out.append((pair["misleading"]["image"], mis.render()))

    # ---------- hidden uncertainty ----------
    elif mech == "hidden-uncertainty":
        all_years = d["histYears"] + d["forecastYears"]
        all_vals = d["histValues"] + d["forecastValues"]
        y_min = 0
        y_max = max(v + h for v, h in zip(d["forecastValues"], d["uncertaintyHalfwidth"])) * 1.1

        acc = Chart(pair["accurate"]["title"])
        draw_uncertainty_chart(acc, [str(y) for y in all_years],
                               d["histValues"], d["forecastValues"],
                               d["uncertaintyHalfwidth"], y_min, y_max,
                               d["yLabel"], show_band=True)
        out.append((pair["accurate"]["image"], acc.render()))

        mis = Chart(pair["misleading"]["title"])
        draw_uncertainty_chart(mis, [str(y) for y in all_years],
                               d["histValues"], d["forecastValues"],
                               d["uncertaintyHalfwidth"], y_min, y_max,
                               d["yLabel"], show_band=False)
        out.append((pair["misleading"]["image"], mis.render()))

    # ---------- area distortion ----------
    elif mech == "area-distortion":
        acc = Chart(pair["accurate"]["title"])
        draw_bubble_chart(acc, d["categories"], d["values"], d["unit"], radius_proportional_to_value=False)
        out.append((pair["accurate"]["image"], acc.render()))

        mis = Chart(pair["misleading"]["title"])
        draw_bubble_chart(mis, d["categories"], d["values"], d["unit"], radius_proportional_to_value=True)
        out.append((pair["misleading"]["image"], mis.render()))

    # ---------- color emphasis ----------
    elif mech == "color-emphasis":
        y_min = min(d["values"]) * 0.85
        y_max = max(d["values"]) * 1.05

        acc = Chart(pair["accurate"]["title"])
        draw_bar_chart(acc, d["categories"], d["values"],
                       y_min, y_max, d["yLabel"], highlight_index=None)
        out.append((pair["accurate"]["image"], acc.render()))

        mis = Chart(pair["misleading"]["title"])
        draw_bar_chart(mis, d["categories"], d["values"],
                       y_min, y_max, d["yLabel"], highlight_index=d["highlightIndex"])
        out.append((pair["misleading"]["image"], mis.render()))

    # ---------- misleading title ----------
    elif mech == "misleading-title":
        series1 = {"label": d["series1Label"], "values": d["series1"], "color": BLUE}
        series2 = {"label": d["series2Label"], "values": d["series2"], "color": ACCENT}
        y_min = 0
        y_max = max(max(d["series1"]), max(d["series2"])) * 1.2

        acc = Chart(pair["accurate"]["title"])
        draw_line_chart(acc, d["x"], [series1, series2], y_min, y_max,
                        "数值", legend=True)
        out.append((pair["accurate"]["image"], acc.render()))

        mis = Chart(pair["misleading"]["title"])
        draw_line_chart(mis, d["x"], [series1, series2], y_min, y_max,
                        "数值", legend=True)
        out.append((pair["misleading"]["image"], mis.render()))

    return out


def main():
    with open(DATA_PATH, encoding="utf-8") as f:
        spec = json.load(f)

    os.makedirs(OUT_DIR, exist_ok=True)

    # Assign neutral IDs in deterministic order
    mapping = {}
    counter = 1
    for pair in spec["pairs"]:
        for key in ("accurate", "misleading"):
            sid = f"S{counter:03d}.svg"
            pair[key]["image"] = sid
            counter += 1

    for pair in spec["pairs"]:
        rendered = build_pair(pair, 0)
        for fname, svg in rendered:
            path = os.path.join(OUT_DIR, fname)
            with open(path, "w", encoding="utf-8") as f:
                f.write(svg)
            mapping[fname] = {
                "pair_id": pair["pairId"],
                "mechanism": pair["mechanism"],
                "integrity": "accurate" if fname == pair["accurate"]["image"] else "misleading",
            }

    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(spec, f, ensure_ascii=False, indent=2)

    with open(MAP_PATH, "w", encoding="utf-8") as f:
        json.dump(mapping, f, ensure_ascii=False, indent=2)

    with open(JS_DATA_PATH, "w", encoding="utf-8") as f:
        f.write("window.MISVIS_VERIFY_STIMULI = ")
        f.write(json.dumps(spec, ensure_ascii=False, indent=2))
        f.write(";\n\nwindow.MISVIS_VERIFY_STIMULUS_MAP = ")
        f.write(json.dumps(mapping, ensure_ascii=False, indent=2))
        f.write(";\n")

    print(f"Generated {counter - 1} SVGs into {OUT_DIR}")
    print(f"Wrote mapping to {MAP_PATH}")
    print(f"Wrote JS data to {JS_DATA_PATH}")


if __name__ == "__main__":
    main()
