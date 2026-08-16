#!/usr/bin/env python3
"""Add AI interpretation variants to study/data/stimuli.json.

Each main pair gets 2 variants for the accurate version and 2 variants for the
misleading version. Variants differ in tone and AI-status wording so the
"AI-assisted" provenance cue carries actual interpretive content.
"""

import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, "study", "data", "stimuli.json")

INTERPRETATIONS = {
    "TA-01": {
        "accurate": [
            {"tone": "neutral", "status": "分析完成", "confidence": 87,
             "text": "纵轴从 0 开始，两线柱状高度与真实数值成比例。1号线 92 万人次，2号线 83 万人次，实际差距约 9 万，视觉差异未夸大。"},
            {"tone": "authoritative", "status": "高置信度", "confidence": 94,
             "text": "该图坐标轴设置规范，两条线路载客量差距约为 10%，柱状长度真实反映了这一比例，可视为准确的表达。"}
        ],
        "misleading": [
            {"tone": "enthusiastic", "status": "分析完成", "confidence": 89,
             "text": "1号线柱状明显长于2号线，说明两条线路的日均载客量存在显著差距，1号线客流规模优势突出。"},
            {"tone": "confident", "status": "高置信度", "confidence": 92,
             "text": "模型判断：1号线与2号线载客量差异 visually striking，1号线在客流竞争中处于明显领先地位。"}
        ]
    },
    "TA-02": {
        "accurate": [
            {"tone": "neutral", "status": "分析完成", "confidence": 86,
             "text": "纵轴从 0 开始，甲校 96% 与乙校 91% 的差距为 5 个百分点，柱长比例与数值一致，未产生视觉夸大。"},
            {"tone": "authoritative", "status": "高置信度", "confidence": 93,
             "text": "该图完整呈现了高考一本率数据，两校差距较小，坐标轴处理符合规范，信息表达准确。"}
        ],
        "misleading": [
            {"tone": "enthusiastic", "status": "分析完成", "confidence": 88,
             "text": "甲校一本率大幅领先乙校，两校柱状高度差距悬殊，直观反映出教学质量的显著差异。"},
            {"tone": "confident", "status": "高置信度", "confidence": 91,
             "text": "模型识别出甲校表现明显优于乙校，柱状图清晰展示了这一领先优势，可信度较高。"}
        ]
    },
    "CP-01": {
        "accurate": [
            {"tone": "neutral", "status": "分析完成", "confidence": 85,
             "text": "横轴覆盖 2014–2024 完整时间范围，销量先降后升，2018 年后的上升只是完整趋势的一部分。"},
            {"tone": "authoritative", "status": "高置信度", "confidence": 92,
             "text": "该图呈现了完整的历史销量轨迹，整体呈 U 型回升，时间窗口选择合理，趋势判断可靠。"}
        ],
        "misleading": [
            {"tone": "enthusiastic", "status": "分析完成", "confidence": 90,
             "text": "2018 年以来销量持续攀升，增长势头强劲，图表清晰展示了该品牌手机销量的稳步上升趋势。"},
            {"tone": "confident", "status": "高置信度", "confidence": 93,
             "text": "模型判断：该品牌销量自 2018 年起呈现持续上升态势，未来增长预期积极，数据支持这一结论。"}
        ]
    },
    "CP-02": {
        "accurate": [
            {"tone": "neutral", "status": "分析完成", "confidence": 84,
             "text": "横轴覆盖 2013–2023 完整区间，犯罪率先降后升呈 U 型，2019 年后出现反弹，不能仅看下降段。"},
            {"tone": "authoritative", "status": "高置信度", "confidence": 91,
             "text": "该图展示了完整的犯罪率变化，近期已回升至 2013 年水平，时间范围完整，结论较为全面。"}
        ],
        "misleading": [
            {"tone": "enthusiastic", "status": "分析完成", "confidence": 88,
             "text": "2013–2019 年间犯罪率持续下降，治理成效显著，图表清楚显示了社会治安的不断改善。"},
            {"tone": "confident", "status": "高置信度", "confidence": 92,
             "text": "模型判断：犯罪率呈稳定下降趋势，相关治理措施效果明显，这一趋势具有较高的可信度。"}
        ]
    },
    "HU-01": {
        "accurate": [
            {"tone": "neutral", "status": "分析完成", "confidence": 86,
             "text": "预测曲线附带置信区间，远期预测的不确定性明显大于近期，提醒读者不要过度相信单一点估计。"},
            {"tone": "authoritative", "status": "高置信度", "confidence": 93,
             "text": "该图合理呈现了预测的不确定性范围，2029 年区间较宽，符合预测越远误差越大的统计规律。"}
        ],
        "misleading": [
            {"tone": "enthusiastic", "status": "分析完成", "confidence": 89,
             "text": "营收预测曲线稳步上升，2029 年预计突破 100 百万元，增长前景清晰，趋势向好。"},
            {"tone": "confident", "status": "高置信度", "confidence": 91,
             "text": "模型判断：公司营收将持续增长，预测路径明确，未来几年的增长预期较为乐观。"}
        ]
    },
    "HU-02": {
        "accurate": [
            {"tone": "neutral", "status": "分析完成", "confidence": 85,
             "text": "预测温度附带置信区间，远期区间较宽，说明 6-11 日的温度预测存在较大不确定性，不宜视为精确值。"},
            {"tone": "authoritative", "status": "高置信度", "confidence": 92,
             "text": "该图正确展示了天气预报的不确定性，预测天数越远，温度区间越宽，信息表达符合气象预测规范。"}
        ],
        "misleading": [
            {"tone": "enthusiastic", "status": "分析完成", "confidence": 88,
             "text": "未来几天气温持续上升，6-11 日预计达到 26℃，升温趋势明显，适合安排户外活动。"},
            {"tone": "confident", "status": "高置信度", "confidence": 90,
             "text": "模型判断：气温将稳定上升，中心预测值可信，未来一周整体呈回暖态势。"}
        ]
    },
    "AD-01": {
        "accurate": [
            {"tone": "neutral", "status": "分析完成", "confidence": 87,
             "text": "三个圆形的面积与人口数值成正比，半径按平方根缩放，100:400:900 的人口对应 1:4:9 的面积，视觉比例正确。"},
            {"tone": "authoritative", "status": "高置信度", "confidence": 93,
             "text": "该图采用面积编码且缩放方式规范，城市C虽然视觉最大，但其面积与人口 900 万严格对应，表达准确。"}
        ],
        "misleading": [
            {"tone": "enthusiastic", "status": "分析完成", "confidence": 88,
             "text": "城市C的圆形远大于城市A和城市B，直观显示了三座城市在人口规模上的巨大差距，城市C优势明显。"},
            {"tone": "confident", "status": "高置信度", "confidence": 91,
             "text": "模型判断：城市C常住人口遥遥领先，圆形大小差异清晰反映了城市间的人口层级，结论可靠。"}
        ]
    },
    "AD-02": {
        "accurate": [
            {"tone": "neutral", "status": "分析完成", "confidence": 86,
             "text": "三个圆形面积与市场份额成正比，品牌A、B、C 的份额为 10%、20%、40%，面积比为 1:2:4，视觉呈现准确。"},
            {"tone": "authoritative", "status": "高置信度", "confidence": 92,
             "text": "该图正确运用面积编码，品牌C 的 40% 份额在面积上恰好是品牌A 的 4 倍，比例关系忠实于数据。"}
        ],
        "misleading": [
            {"tone": "enthusiastic", "status": "分析完成", "confidence": 89,
             "text": "品牌C 的市场份额在图中占据绝对主导地位，视觉面积远超其他品牌，显示出强劲的市场控制力。"},
            {"tone": "confident", "status": "高置信度", "confidence": 90,
             "text": "模型判断：品牌C 在市场中遥遥领先，圆形大小差异显著，品牌优势一目了然。"}
        ]
    },
    "CE-01": {
        "accurate": [
            {"tone": "neutral", "status": "分析完成", "confidence": 85,
             "text": "四个区域采用统一配色，空气质量指数分别为 82、85、84、88，数值接近，颜色未对任何区域做特殊强调。"},
            {"tone": "authoritative", "status": "高置信度", "confidence": 92,
             "text": "该图配色一致，各区指数差异很小，没有通过颜色单独突出某个区域，信息表达较为客观。"}
        ],
        "misleading": [
            {"tone": "enthusiastic", "status": "分析完成", "confidence": 88,
             "text": "南区被单独标红，空气质量指数最高，需要重点关注，图表有效突出了这一风险区域。"},
            {"tone": "confident", "status": "高置信度", "confidence": 90,
             "text": "模型判断：南区空气质量明显劣于其他区域，红色高亮合理强调了这一异常，建议优先关注。"}
        ]
    },
    "CE-02": {
        "accurate": [
            {"tone": "neutral", "status": "分析完成", "confidence": 86,
             "text": "四个部门采用统一配色，预算执行率分别为 87%、89%、86%、91%，差异很小，颜色未对部门D做特殊处理。"},
            {"tone": "authoritative", "status": "高置信度", "confidence": 93,
             "text": "该图配色统一，各部门执行率均处于相近水平，没有通过颜色制造人为的异常感，表达准确。"}
        ],
        "misleading": [
            {"tone": "enthusiastic", "status": "分析完成", "confidence": 88,
             "text": "部门D被单独标红，执行率最高，表现突出，图表有效强调了部门D在预算执行上的领先地位。"},
            {"tone": "confident", "status": "高置信度", "confidence": 91,
             "text": "模型判断：部门D执行率显著高于其他部门，红色高亮有助于快速识别优秀表现，信息清晰。"}
        ]
    },
    "MT-01": {
        "accurate": [
            {"tone": "neutral", "status": "分析完成", "confidence": 85,
             "text": "标题仅表述运动次数与幸福感的相关性，未断言因果关系，图表本身只展示了两条同步上升的曲线。"},
            {"tone": "authoritative", "status": "高置信度", "confidence": 92,
             "text": "该图标题措辞谨慎，仅说明相关关系，没有因果推断，符合数据可视化的规范表达。"}
        ],
        "misleading": [
            {"tone": "enthusiastic", "status": "分析完成", "confidence": 89,
             "text": "每周运动次数增加显著提升主观幸福感，两条曲线同步上升，说明运动对幸福感有积极推动作用。"},
            {"tone": "confident", "status": "高置信度", "confidence": 90,
             "text": "模型判断：运动与幸福感之间存在正向影响关系，标题准确概括了图表传达的核心发现。"}
        ]
    },
    "MT-02": {
        "accurate": [
            {"tone": "neutral", "status": "分析完成", "confidence": 86,
             "text": "标题仅说明咖啡摄入与工作效率评分的相关性，未断言因果，图表展示的是两条同向变化曲线。"},
            {"tone": "authoritative", "status": "高置信度", "confidence": 92,
             "text": "该图标题使用相关性表述，避免了因果推断，数据仅支持同向变化，不能证明咖啡提升效率。"}
        ],
        "misleading": [
            {"tone": "enthusiastic", "status": "分析完成", "confidence": 88,
             "text": "喝咖啡显著提升工作效率，两条曲线同步上升，数据表明咖啡摄入与工作效率之间存在积极关系。"},
            {"tone": "confident", "status": "高置信度", "confidence": 91,
             "text": "模型判断：咖啡摄入对工作效率有正向促进作用，标题清晰表达了这一因果发现，信息明确。"}
        ]
    }
}


def main():
    with open(PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    for pair in data["pairs"]:
        pair_id = pair["pairId"]
        if pair_id in INTERPRETATIONS:
            pair["aiInterpretations"] = INTERPRETATIONS[pair_id]
        else:
            print(f"Warning: no AI interpretations for {pair_id}")

    with open(PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Updated {PATH}")


if __name__ == "__main__":
    main()
