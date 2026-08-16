window.MISVIS_VERIFY_STIMULI = {
  "version": "stimuli-v0.3",
  "pairs": [
    {
      "pairId": "TA-01",
      "mechanism": "truncated-axis",
      "context": "public-transport",
      "chartTitle": "两条地铁线路日均载客量",
      "data": {
        "categories": [
          "1号线",
          "2号线"
        ],
        "values": [
          92,
          83
        ],
        "yLabel": "万人次/日",
        "yMaxAccurate": 100,
        "yMinMisleading": 80,
        "yMaxMisleading": 100
      },
      "accurate": {
        "image": "S001.svg",
        "title": "两条地铁线路日均载客量",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S002.svg",
        "title": "两条地铁线路日均载客量",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查纵轴的起始位置。它从哪里开始？",
        "explain": "柱状图主要依赖柱子的长度比较大小。当共同基线不是零时，柱长的视觉差异会被放大，因为人眼比较的是长度而非数值。",
        "verify": "1号线 = 92 万人次，2号线 = 83 万人次。两者实际相差 9 个单位，约为 10.8%。",
        "compareAccurate": "结论：当前图表是正确版本。这是纵轴从零开始的版本，柱长差异与真实数值差异成比例。",
        "compareMisleading": "结论：当前图表是误导版本。这是纵轴从 80 开始的版本，9 个单位的差距被放大成明显的视觉长度差异。",
        "annotation": {
          "x": 18,
          "y": 20
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 87,
            "text": "纵轴从 0 开始，两线柱状高度与真实数值成比例。1号线 92 万人次，2号线 83 万人次，实际差距约 9 万，视觉差异未夸大。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 94,
            "text": "该图坐标轴设置规范，两条线路载客量差距约为 10%，柱状长度真实反映了这一比例，可视为准确的表达。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 89,
            "text": "1号线柱状明显长于2号线，说明两条线路的日均载客量存在显著差距，1号线客流规模优势突出。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 92,
            "text": "模型判断：1号线与2号线载客量差异 visually striking，1号线在客流竞争中处于明显领先地位。"
          }
        ]
      }
    },
    {
      "pairId": "TA-02",
      "mechanism": "truncated-axis",
      "context": "school-enrollment",
      "chartTitle": "两所中学高考一本率",
      "data": {
        "categories": [
          "甲校",
          "乙校"
        ],
        "values": [
          96,
          91
        ],
        "yLabel": "一本率（%）",
        "yMaxAccurate": 100,
        "yMinMisleading": 88,
        "yMaxMisleading": 98
      },
      "accurate": {
        "image": "S003.svg",
        "title": "两所中学高考一本率",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S004.svg",
        "title": "两所中学高考一本率",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查纵轴的起始位置。它从哪里开始？",
        "explain": "柱状图依赖共同基线。当纵轴从接近最小值处开始，两校 5 个百分点的差距会被视觉上夸大。",
        "verify": "甲校 = 96%，乙校 = 91%。两者实际相差 5 个百分点。",
        "compareAccurate": "结论：当前图表是正确版本。这是纵轴从零开始的版本，两校差异保持真实比例。",
        "compareMisleading": "结论：当前图表是误导版本。这是纵轴从 88 开始的版本，5 个百分点的差距看起来接近数倍。",
        "annotation": {
          "x": 18,
          "y": 20
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 86,
            "text": "纵轴从 0 开始，甲校 96% 与乙校 91% 的差距为 5 个百分点，柱长比例与数值一致，未产生视觉夸大。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 93,
            "text": "该图完整呈现了高考一本率数据，两校差距较小，坐标轴处理符合规范，信息表达准确。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 88,
            "text": "甲校一本率大幅领先乙校，两校柱状高度差距悬殊，直观反映出教学质量的显著差异。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 91,
            "text": "模型识别出甲校表现明显优于乙校，柱状图清晰展示了这一领先优势，可信度较高。"
          }
        ]
      }
    },
    {
      "pairId": "CP-01",
      "mechanism": "cherry-picked-time",
      "context": "phone-sales",
      "chartTitle": "某品牌手机年度销量",
      "data": {
        "xLabel": "年份",
        "yLabel": "销量（万台）",
        "fullYears": [
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022,
          2023,
          2024
        ],
        "fullValues": [
          60,
          55,
          50,
          48,
          52,
          58,
          63,
          70,
          78,
          85,
          90
        ],
        "cherryYears": [
          2018,
          2019,
          2020,
          2021,
          2022,
          2023,
          2024
        ],
        "cherryValues": [
          52,
          58,
          63,
          70,
          78,
          85,
          90
        ]
      },
      "accurate": {
        "image": "S005.svg",
        "title": "某品牌手机年度销量（2014–2024）",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S006.svg",
        "title": "某品牌手机年度销量（2018–2024）",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查横轴的时间范围。它覆盖了哪些年份？",
        "explain": "时间窗口决定了趋势叙事。只选择上升区间，会让一个整体波动甚至先降后升的序列看起来像持续增长。",
        "verify": "完整序列 2014–2024 为先降后升：60 → 48 → 90。截取的 2018–2024 只显示了上升段。",
        "compareAccurate": "结论：当前图表是正确版本。这是完整时间范围，可以看到销量先下降后回升。",
        "compareMisleading": "结论：当前图表是误导版本。这是截取的 2018–2024 区间，只呈现上升趋势。",
        "annotation": {
          "x": 20,
          "y": 85
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 85,
            "text": "横轴覆盖 2014–2024 完整时间范围，销量先降后升，2018 年后的上升只是完整趋势的一部分。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 92,
            "text": "该图呈现了完整的历史销量轨迹，整体呈 U 型回升，时间窗口选择合理，趋势判断可靠。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 90,
            "text": "2018 年以来销量持续攀升，增长势头强劲，图表清晰展示了该品牌手机销量的稳步上升趋势。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 93,
            "text": "模型判断：该品牌销量自 2018 年起呈现持续上升态势，未来增长预期积极，数据支持这一结论。"
          }
        ]
      }
    },
    {
      "pairId": "CP-02",
      "mechanism": "cherry-picked-time",
      "context": "crime-rate",
      "chartTitle": "某市犯罪率",
      "data": {
        "xLabel": "年份",
        "yLabel": "每万人案件数",
        "fullYears": [
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022,
          2023
        ],
        "fullValues": [
          45,
          42,
          40,
          38,
          36,
          34,
          33,
          35,
          38,
          42,
          45
        ],
        "cherryYears": [
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019
        ],
        "cherryValues": [
          45,
          42,
          40,
          38,
          36,
          34,
          33
        ]
      },
      "accurate": {
        "image": "S007.svg",
        "title": "某市犯罪率（2013–2023）",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S008.svg",
        "title": "某市犯罪率（2013–2019）",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查横轴的时间范围。它在哪里结束？",
        "explain": "只展示下降区间会隐藏最近的反弹。完整的 U 型序列说明犯罪率先降后升。",
        "verify": "完整序列 2013–2023 为 U 型：45 → 33 → 45。截取的 2013–2019 只显示下降段。",
        "compareAccurate": "结论：当前图表是正确版本。这是完整时间范围，可以看到犯罪率近年回升。",
        "compareMisleading": "结论：当前图表是误导版本。这是截取的 2013–2019 区间，只呈现持续下降。",
        "annotation": {
          "x": 78,
          "y": 80
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 84,
            "text": "横轴覆盖 2013–2023 完整区间，犯罪率先降后升呈 U 型，2019 年后出现反弹，不能仅看下降段。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 91,
            "text": "该图展示了完整的犯罪率变化，近期已回升至 2013 年水平，时间范围完整，结论较为全面。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 88,
            "text": "2013–2019 年间犯罪率持续下降，治理成效显著，图表清楚显示了社会治安的不断改善。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 92,
            "text": "模型判断：犯罪率呈稳定下降趋势，相关治理措施效果明显，这一趋势具有较高的可信度。"
          }
        ]
      }
    },
    {
      "pairId": "HU-01",
      "mechanism": "hidden-uncertainty",
      "context": "revenue-forecast",
      "chartTitle": "某公司营收预测",
      "data": {
        "xLabel": "年份",
        "yLabel": "营收（百万元）",
        "histYears": [
          2020,
          2021,
          2022,
          2023,
          2024
        ],
        "histValues": [
          50,
          55,
          60,
          62,
          68
        ],
        "forecastYears": [
          2025,
          2026,
          2027,
          2028,
          2029
        ],
        "forecastValues": [
          72,
          78,
          85,
          93,
          102
        ],
        "uncertaintyHalfwidth": [
          5,
          10,
          16,
          24,
          34
        ]
      },
      "accurate": {
        "image": "S009.svg",
        "title": "某公司营收预测（含置信区间）",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S010.svg",
        "title": "某公司营收预测",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查预测曲线附近是否显示了不确定性范围。",
        "explain": "预测越远，不确定性通常越高。省略置信区间会让模型预测看起来像已经确定发生的事实。",
        "verify": "2029 年中心预测为 102，但置信区间约为 68–136，范围远大于中心值本身的增长。",
        "compareAccurate": "结论：当前图表是正确版本。这是带置信区间的版本，越远的不确定性越宽。",
        "compareMisleading": "结论：当前图表是误导版本。这是只保留中心预测线的版本，隐藏了误差范围。",
        "annotation": {
          "x": 82,
          "y": 30
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 86,
            "text": "预测曲线附带置信区间，远期预测的不确定性明显大于近期，提醒读者不要过度相信单一点估计。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 93,
            "text": "该图合理呈现了预测的不确定性范围，2029 年区间较宽，符合预测越远误差越大的统计规律。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 89,
            "text": "营收预测曲线稳步上升，2029 年预计突破 100 百万元，增长前景清晰，趋势向好。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 91,
            "text": "模型判断：公司营收将持续增长，预测路径明确，未来几年的增长预期较为乐观。"
          }
        ]
      }
    },
    {
      "pairId": "HU-02",
      "mechanism": "hidden-uncertainty",
      "context": "temperature-forecast",
      "chartTitle": "某地未来日均温预测",
      "data": {
        "xLabel": "日期",
        "yLabel": "日均温（℃）",
        "histYears": [
          "6-01",
          "6-02",
          "6-03",
          "6-04",
          "6-05",
          "6-06"
        ],
        "histValues": [
          18,
          19,
          20,
          21,
          22,
          21
        ],
        "forecastYears": [
          "6-07",
          "6-08",
          "6-09",
          "6-10",
          "6-11"
        ],
        "forecastValues": [
          22,
          23,
          24,
          25,
          26
        ],
        "uncertaintyHalfwidth": [
          1.5,
          2.5,
          4.0,
          6.0,
          8.0
        ]
      },
      "accurate": {
        "image": "S011.svg",
        "title": "某地未来日均温预测（含置信区间）",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S012.svg",
        "title": "某地未来日均温预测",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查预测曲线附近是否显示了不确定性范围。",
        "explain": "天气预报的不确定性随预测天数增加而增大。省略区间会让人误以为远期温度是精确值。",
        "verify": "6-11 中心预测为 26℃，但区间约为 18–34℃，远超中心值。",
        "compareAccurate": "结论：当前图表是正确版本。这是带置信区间的版本，远期不确定性明显更宽。",
        "compareMisleading": "结论：当前图表是误导版本。这是只保留中心预测线的版本，隐藏了误差范围。",
        "annotation": {
          "x": 82,
          "y": 28
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 85,
            "text": "预测温度附带置信区间，远期区间较宽，说明 6-11 日的温度预测存在较大不确定性，不宜视为精确值。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 92,
            "text": "该图正确展示了天气预报的不确定性，预测天数越远，温度区间越宽，信息表达符合气象预测规范。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 88,
            "text": "未来几天气温持续上升，6-11 日预计达到 26℃，升温趋势明显，适合安排户外活动。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 90,
            "text": "模型判断：气温将稳定上升，中心预测值可信，未来一周整体呈回暖态势。"
          }
        ]
      }
    },
    {
      "pairId": "AD-01",
      "mechanism": "area-distortion",
      "context": "city-population",
      "chartTitle": "三座城市常住人口",
      "data": {
        "categories": [
          "城市A",
          "城市B",
          "城市C"
        ],
        "values": [
          100,
          400,
          900
        ],
        "unit": "万人"
      },
      "accurate": {
        "image": "S013.svg",
        "title": "三座城市常住人口",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S014.svg",
        "title": "三座城市常住人口",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查圆形的大小。圆的面积还是半径对应数值？",
        "explain": "圆形图用面积表达数量，但人眼常误用直径或半径比较。若半径直接正比于数值，面积差异会被平方放大。",
        "verify": "人口为 100 : 400 : 900（即 1 : 4 : 9）。正确时面积比应为 1 : 4 : 9，半径比为 1 : 2 : 3。",
        "compareAccurate": "结论：当前图表是正确版本。这是面积正比于数值的版本，半径按平方根缩放。",
        "compareMisleading": "结论：当前图表是误导版本。这是半径正比于数值的版本，面积差异被平方放大。",
        "annotation": {
          "x": 50,
          "y": 50
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 87,
            "text": "三个圆形的面积与人口数值成正比，半径按平方根缩放，100:400:900 的人口对应 1:4:9 的面积，视觉比例正确。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 93,
            "text": "该图采用面积编码且缩放方式规范，城市C虽然视觉最大，但其面积与人口 900 万严格对应，表达准确。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 88,
            "text": "城市C的圆形远大于城市A和城市B，直观显示了三座城市在人口规模上的巨大差距，城市C优势明显。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 91,
            "text": "模型判断：城市C常住人口遥遥领先，圆形大小差异清晰反映了城市间的人口层级，结论可靠。"
          }
        ]
      }
    },
    {
      "pairId": "AD-02",
      "mechanism": "area-distortion",
      "context": "market-share",
      "chartTitle": "三个品牌市场份额",
      "data": {
        "categories": [
          "品牌A",
          "品牌B",
          "品牌C"
        ],
        "values": [
          10,
          20,
          40
        ],
        "unit": "%"
      },
      "accurate": {
        "image": "S015.svg",
        "title": "三个品牌市场份额",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S016.svg",
        "title": "三个品牌市场份额",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查圆形的大小。圆的面积还是半径对应数值？",
        "explain": "份额为 10% : 20% : 40%（即 1 : 2 : 4）。若半径直接正比于份额，面积比会变成 1 : 4 : 16，夸大差距。",
        "verify": "正确面积比应为 1 : 2 : 4，对应半径比为 1 : 1.41 : 2。",
        "compareAccurate": "结论：当前图表是正确版本。这是面积正比于份额的版本。",
        "compareMisleading": "结论：当前图表是误导版本。这是半径正比于份额的版本，面积差异被平方放大。",
        "annotation": {
          "x": 50,
          "y": 50
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 86,
            "text": "三个圆形面积与市场份额成正比，品牌A、B、C 的份额为 10%、20%、40%，面积比为 1:2:4，视觉呈现准确。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 92,
            "text": "该图正确运用面积编码，品牌C 的 40% 份额在面积上恰好是品牌A 的 4 倍，比例关系忠实于数据。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 89,
            "text": "品牌C 的市场份额在图中占据绝对主导地位，视觉面积远超其他品牌，显示出强劲的市场控制力。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 90,
            "text": "模型判断：品牌C 在市场中遥遥领先，圆形大小差异显著，品牌优势一目了然。"
          }
        ]
      }
    },
    {
      "pairId": "CE-01",
      "mechanism": "color-emphasis",
      "context": "air-quality",
      "chartTitle": "四区空气质量指数",
      "data": {
        "categories": [
          "东区",
          "西区",
          "北区",
          "南区"
        ],
        "values": [
          82,
          85,
          84,
          88
        ],
        "yLabel": "指数",
        "highlightIndex": 3,
        "highlightLabel": "南区"
      },
      "accurate": {
        "image": "S017.svg",
        "title": "四区空气质量指数",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S018.svg",
        "title": "四区空气质量指数",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查各柱子的颜色是否一致。",
        "explain": "颜色具有前注意特征。高饱和红色会抢占注意力并带来风险与警告联想，即使数值差异很小。",
        "verify": "四区指数为 82、85、84、88，差异极小，但南区被单独标红。",
        "compareAccurate": "结论：当前图表是正确版本。这是统一配色的版本，各区差异看起来一致。",
        "compareMisleading": "结论：当前图表是误导版本。这是南区单独标红的版本，情绪强调放大了轻微差异。",
        "annotation": {
          "x": 80,
          "y": 30
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 85,
            "text": "四个区域采用统一配色，空气质量指数分别为 82、85、84、88，数值接近，颜色未对任何区域做特殊强调。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 92,
            "text": "该图配色一致，各区指数差异很小，没有通过颜色单独突出某个区域，信息表达较为客观。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 88,
            "text": "南区被单独标红，空气质量指数最高，需要重点关注，图表有效突出了这一风险区域。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 90,
            "text": "模型判断：南区空气质量明显劣于其他区域，红色高亮合理强调了这一异常，建议优先关注。"
          }
        ]
      }
    },
    {
      "pairId": "CE-02",
      "mechanism": "color-emphasis",
      "context": "budget-execution",
      "chartTitle": "四部门预算执行率",
      "data": {
        "categories": [
          "部门A",
          "部门B",
          "部门C",
          "部门D"
        ],
        "values": [
          87,
          89,
          86,
          91
        ],
        "yLabel": "执行率（%）",
        "highlightIndex": 3,
        "highlightLabel": "部门D"
      },
      "accurate": {
        "image": "S019.svg",
        "title": "四部门预算执行率",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S020.svg",
        "title": "四部门预算执行率",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查各柱子的颜色是否一致。",
        "explain": "无数据依据地给某项加高饱和红色，会让读者把轻微差异解读为重大异常。",
        "verify": "四部门执行率为 87、89、86、91%，差异很小，但部门D被单独标红。",
        "compareAccurate": "结论：当前图表是正确版本。这是统一配色的版本。",
        "compareMisleading": "结论：当前图表是误导版本。这是部门D单独标红的版本，情绪强调放大了轻微差异。",
        "annotation": {
          "x": 80,
          "y": 30
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 86,
            "text": "四个部门采用统一配色，预算执行率分别为 87%、89%、86%、91%，差异很小，颜色未对部门D做特殊处理。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 93,
            "text": "该图配色统一，各部门执行率均处于相近水平，没有通过颜色制造人为的异常感，表达准确。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 88,
            "text": "部门D被单独标红，执行率最高，表现突出，图表有效强调了部门D在预算执行上的领先地位。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 91,
            "text": "模型判断：部门D执行率显著高于其他部门，红色高亮有助于快速识别优秀表现，信息清晰。"
          }
        ]
      }
    },
    {
      "pairId": "MT-01",
      "mechanism": "misleading-title",
      "context": "exercise-happiness",
      "chartTitle": "每周运动次数与主观幸福感",
      "data": {
        "xLabel": "月份",
        "series1Label": "运动次数（次/周）",
        "series2Label": "幸福感评分（0–10）",
        "x": [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月"
        ],
        "series1": [
          1,
          1.5,
          2,
          2.5,
          3,
          3.5,
          4,
          4.5
        ],
        "series2": [
          5.0,
          5.4,
          5.8,
          6.2,
          6.6,
          7.0,
          7.4,
          7.8
        ]
      },
      "accurate": {
        "image": "S021.svg",
        "title": "每周运动次数与主观幸福感的相关性",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S022.svg",
        "title": "运动越多，幸福感越高",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查图表标题是否把相关性表述为因果关系。",
        "explain": "两条曲线同向变化只能说明相关，不能证明一方导致另一方。可能还有共同原因（如健康状况、收入）。",
        "verify": "图表本身只显示两条同向上升的曲线，没有任何因果证据。",
        "compareAccurate": "结论：当前图表是正确版本。这是中性描述相关性的标题。",
        "compareMisleading": "结论：当前图表是误导版本。这是把相关表述为因果的标题。",
        "annotation": {
          "x": 50,
          "y": 10
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 85,
            "text": "标题仅表述运动次数与幸福感的相关性，未断言因果关系，图表本身只展示了两条同步上升的曲线。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 92,
            "text": "该图标题措辞谨慎，仅说明相关关系，没有因果推断，符合数据可视化的规范表达。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 89,
            "text": "每周运动次数增加显著提升主观幸福感，两条曲线同步上升，说明运动对幸福感有积极推动作用。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 90,
            "text": "模型判断：运动与幸福感之间存在正向影响关系，标题准确概括了图表传达的核心发现。"
          }
        ]
      }
    },
    {
      "pairId": "MT-02",
      "mechanism": "misleading-title",
      "context": "coffee-productivity",
      "chartTitle": "每日咖啡摄入与工作效率",
      "data": {
        "xLabel": "月份",
        "series1Label": "咖啡杯数（杯/日）",
        "series2Label": "工作效率评分（0–10）",
        "x": [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月"
        ],
        "series1": [
          0.5,
          1,
          1.5,
          2,
          2.5,
          3,
          3.5,
          4
        ],
        "series2": [
          3.0,
          3.4,
          3.8,
          4.2,
          4.6,
          5.0,
          5.4,
          5.8
        ]
      },
      "accurate": {
        "image": "S023.svg",
        "title": "每日咖啡摄入与工作效率评分的相关性",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S024.svg",
        "title": "喝咖啡显著提升工作效率",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查图表标题是否把相关性表述为因果关系。",
        "explain": "咖啡摄入与效率同向变化只是相关，可能由共同因素（如工作强度、季节）驱动。",
        "verify": "图表本身只显示两条同向上升的曲线，没有任何因果证据。",
        "compareAccurate": "结论：当前图表是正确版本。这是中性描述相关性的标题。",
        "compareMisleading": "结论：当前图表是误导版本。这是把相关表述为因果的标题。",
        "annotation": {
          "x": 50,
          "y": 10
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 86,
            "text": "标题仅说明咖啡摄入与工作效率评分的相关性，未断言因果，图表展示的是两条同向变化曲线。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 92,
            "text": "该图标题使用相关性表述，避免了因果推断，数据仅支持同向变化，不能证明咖啡提升效率。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 88,
            "text": "喝咖啡显著提升工作效率，两条曲线同步上升，数据表明咖啡摄入与工作效率之间存在积极关系。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 91,
            "text": "模型判断：咖啡摄入对工作效率有正向促进作用，标题清晰表达了这一因果发现，信息明确。"
          }
        ]
      }
    },
    {
      "pairId": "MN-01",
      "mechanism": "missing-normalization",
      "context": "school-awards",
      "chartTitle": "两所学校省级奖项数量",
      "data": {
        "categories": [
          "甲校",
          "乙校"
        ],
        "rawValues": [
          50,
          20
        ],
        "rawLabel": "获奖总数（项）",
        "rawYMax": 60,
        "rateValues": [
          2.0,
          4.0
        ],
        "rateLabel": "每百名学生获奖数（项）",
        "rateYMax": 5,
        "subtitle": "甲校在校生 2500 人，乙校在校生 500 人"
      },
      "accurate": {
        "image": "S025.svg",
        "title": "两所学校每百名学生获奖数量",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S026.svg",
        "title": "两所学校省级奖项数量",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查纵轴指标：是获奖总数，还是按学生人数折算的比例？",
        "explain": "比较规模不同的学校时，直接比较总数会掩盖在校生数量差异。人数多的学校天然更容易获得更多奖项，应当比较人均或比例指标。",
        "verify": "甲校 50 项（2500 人，2.0 项/百人），乙校 20 项（500 人，4.0 项/百人）。乙校的人均获奖数更高。",
        "compareAccurate": "结论：当前图表是正确版本。这是按每百名学生折算的版本，乙校的人均获奖数更高。",
        "compareMisleading": "结论：当前图表是误导版本。这是直接比较总数的版本，掩盖了两校在校生规模的差异。",
        "annotation": {
          "x": 30,
          "y": 50
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 87,
            "text": "图表按每百名学生折算获奖数，甲校 2.0 项、乙校 4.0 项，已考虑两校在校生规模差异，对比口径合理。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 93,
            "text": "该图采用人均口径比较，乙校人均获奖数高于甲校，数据口径统一，信息表达准确。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 89,
            "text": "甲校获奖总数高达 50 项，是乙校的 2.5 倍，办学成果显著领先，两校差距一目了然。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 91,
            "text": "模型判断：甲校获奖数量遥遥领先，图表清晰反映了甲校的突出表现，可信度较高。"
          }
        ]
      }
    },
    {
      "pairId": "MN-02",
      "mechanism": "missing-normalization",
      "context": "hospital-recovery",
      "chartTitle": "两所医院治愈人数",
      "data": {
        "categories": [
          "甲医院",
          "乙医院"
        ],
        "rawValues": [
          400,
          100
        ],
        "rawLabel": "治愈人数（人）",
        "rawYMax": 450,
        "rateValues": [
          20,
          50
        ],
        "rateLabel": "治愈率（%）",
        "rateYMax": 60,
        "subtitle": "甲医院收治患者 2000 人，乙医院收治患者 200 人"
      },
      "accurate": {
        "image": "S027.svg",
        "title": "两所医院治愈率",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S028.svg",
        "title": "两所医院治愈人数",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查纵轴指标：是治愈人数，还是治愈率？",
        "explain": "比较不同规模的医院时，治愈人数受收治患者数量影响。收治人数多的医院治愈人数天然更多，应当比较治愈率。",
        "verify": "甲医院治愈 400 人（收治 2000 人，治愈率 20%），乙医院治愈 100 人（收治 200 人，治愈率 50%）。乙医院治愈率更高。",
        "compareAccurate": "结论：当前图表是正确版本。这是按治愈率比较的版本，乙医院表现更好。",
        "compareMisleading": "结论：当前图表是误导版本。这是直接比较治愈人数的版本，掩盖了收治规模的差异。",
        "annotation": {
          "x": 30,
          "y": 50
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 86,
            "text": "图表按治愈率比较，甲医院 20%、乙医院 50%，已考虑收治患者数量差异，口径合理。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 92,
            "text": "该图采用治愈率指标，乙医院治愈率更高，比较口径统一，结论可靠。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 88,
            "text": "甲医院治愈人数 400 人，是乙医院的 4 倍，医疗实力显著更强，领先优势明显。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 90,
            "text": "模型判断：甲医院治愈人数大幅领先，治疗效果突出，图表信息清晰明确。"
          }
        ]
      }
    },
    {
      "pairId": "OC-01",
      "mechanism": "overusing-colors",
      "context": "factory-energy",
      "chartTitle": "五家工厂月度能耗",
      "data": {
        "xLabel": "月份",
        "yLabel": "能耗（万千瓦时）",
        "x": [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月"
        ],
        "series": [
          {
            "label": "工厂A",
            "values": [
              52,
              54,
              55,
              53,
              56,
              58,
              57,
              59
            ]
          },
          {
            "label": "工厂B",
            "values": [
              48,
              50,
              52,
              54,
              53,
              55,
              57,
              58
            ]
          },
          {
            "label": "工厂C",
            "values": [
              60,
              61,
              59,
              62,
              63,
              61,
              64,
              65
            ]
          },
          {
            "label": "工厂D",
            "values": [
              55,
              57,
              58,
              56,
              59,
              60,
              62,
              63
            ]
          },
          {
            "label": "工厂E",
            "values": [
              50,
              49,
              51,
              52,
              54,
              53,
              55,
              56
            ]
          }
        ]
      },
      "accurate": {
        "image": "S029.svg",
        "title": "五家工厂月度能耗",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S030.svg",
        "title": "五家工厂月度能耗",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查各条曲线的颜色：这些颜色在表达什么含义？",
        "explain": "颜色具有语义。红、绿、蓝等类别色暗示不同组之间是性质不同的类别；同一色系的深浅（顺序色）只表达数值大小差异。用彩虹色编码数值接近的多条曲线，会制造人为的类别差异感。",
        "verify": "五家工厂能耗都在 48–65 万千瓦时之间，数值接近，但图中使用了多种高饱和类别色，视觉上强化了差异。",
        "compareAccurate": "结论：当前图表是正确版本。这是同色系渐变编码，颜色只反映数值大小，不暗示类别差异。",
        "compareMisleading": "结论：当前图表是误导版本。这是彩虹色编码，高饱和的类别色暗示五家工厂属于截然不同的水平。",
        "annotation": {
          "x": 50,
          "y": 20
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 86,
            "text": "各曲线使用同色系渐变编码，五家工厂能耗数值接近，颜色未制造额外差异。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 92,
            "text": "该图采用顺序色编码，颜色深浅与数值大小一致，未夸大工厂间的能耗差异，表达规范。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 89,
            "text": "五家工厂能耗曲线颜色各异，差异明显，图表直观展示出各厂能耗水平的不同层级。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 91,
            "text": "模型判断：各工厂能耗水平差异显著，彩虹配色帮助快速区分，信息呈现高效直观。"
          }
        ]
      }
    },
    {
      "pairId": "OC-02",
      "mechanism": "overusing-colors",
      "context": "store-revenue",
      "chartTitle": "五家门店月度营业额",
      "data": {
        "xLabel": "月份",
        "yLabel": "营业额（万元）",
        "x": [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月"
        ],
        "series": [
          {
            "label": "门店A",
            "values": [
              42,
              44,
              45,
              43,
              47,
              48,
              50,
              51
            ]
          },
          {
            "label": "门店B",
            "values": [
              38,
              40,
              41,
              43,
              45,
              44,
              46,
              48
            ]
          },
          {
            "label": "门店C",
            "values": [
              50,
              51,
              49,
              52,
              53,
              54,
              55,
              56
            ]
          },
          {
            "label": "门店D",
            "values": [
              45,
              47,
              48,
              46,
              49,
              50,
              52,
              53
            ]
          },
          {
            "label": "门店E",
            "values": [
              40,
              39,
              41,
              42,
              44,
              45,
              46,
              47
            ]
          }
        ]
      },
      "accurate": {
        "image": "S031.svg",
        "title": "五家门店月度营业额",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S032.svg",
        "title": "五家门店月度营业额",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查各条曲线的颜色选择。",
        "explain": "多条曲线数值接近时，使用类别色（红绿蓝）会让人误以为各组差异巨大或性质不同；同色系顺序色只表达程度差异。",
        "verify": "五家门店营业额都在 38–56 万元之间，差异不大，但彩虹配色强化了视觉差异。",
        "compareAccurate": "结论：当前图表是正确版本。这是同色系渐变编码，颜色不夸大差异。",
        "compareMisleading": "结论：当前图表是误导版本。这是彩虹色编码，制造了人为的类别差异。",
        "annotation": {
          "x": 50,
          "y": 20
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 87,
            "text": "各曲线同色系编码，五家门店营业额相近，颜色只反映数值高低，未放大差异。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 92,
            "text": "该图颜色编码规范，未人为强调门店差异，数据呈现客观。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 88,
            "text": "五家门店营业额差异鲜明，颜色区分清晰，经营表现高下立判。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 90,
            "text": "模型判断：门店间营业额差异显著，彩虹配色强化了对比效果，结论直观可信。"
          }
        ]
      }
    },
    {
      "pairId": "IS-01",
      "mechanism": "inappropriate-scale",
      "context": "epidemic-cases",
      "chartTitle": "某市新增确诊病例数",
      "data": {
        "xLabel": "周次",
        "yLabel": "新增病例（例）",
        "x": [
          "第1周",
          "第2周",
          "第3周",
          "第4周",
          "第5周",
          "第6周",
          "第7周",
          "第8周"
        ],
        "values": [
          50,
          75,
          110,
          170,
          260,
          400,
          620,
          950
        ],
        "logMin": 10,
        "logMax": 1000,
        "linearMax": 1000
      },
      "accurate": {
        "image": "S033.svg",
        "title": "某市新增确诊病例数（对数尺度）",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S034.svg",
        "title": "某市新增确诊病例数",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查纵轴刻度。数值从 0 到 1000 是均匀分布，还是按数量级分布？",
        "explain": "病例增长接近指数时，线性尺度会让后期微小的绝对增量在视觉上被极大放大，形成“断崖式暴发”的印象；对数尺度把指数增长展成直线，便于判断增速是否稳定。",
        "verify": "第1周 50 例，第8周 950 例。相邻周之间的环比增速约为 50%，是稳定的指数增长，并非末期突然加速。",
        "compareAccurate": "结论：当前图表是正确版本。纵轴采用对数尺度，把稳定指数增长显示为近似直线，避免了末端的视觉夸大。",
        "compareMisleading": "结论：当前图表是误导版本。纵轴使用线性 0–1000，使曲线末端急剧上扬，制造出疫情在最后一周骤然暴发的错觉。",
        "annotation": {
          "x": 15,
          "y": 20
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 86,
            "text": "该图采用对数尺度，新增病例从 50 增至 950 呈稳定指数趋势，每周环比增速大致相同，末段并未出现异常跳升。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 92,
            "text": "对数尺度下病例增长接近直线，说明增速稳定，线性尺度会夸大后期的视觉冲击，此图表达更符合指数数据特征。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 89,
            "text": "新增确诊病例在第8周接近 1000 例，曲线末端陡峭上扬，显示疫情正在加速扩散，形势不容乐观。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 91,
            "text": "模型判断：病例增长曲线尾部斜率显著增大，说明传播速度加快，需要高度警惕后续走势。"
          }
        ]
      }
    },
    {
      "pairId": "IS-02",
      "mechanism": "inappropriate-scale",
      "context": "investment-growth",
      "chartTitle": "某基金累计收益率",
      "data": {
        "xLabel": "年份",
        "yLabel": "累计收益率（%）",
        "x": [
          "第1年",
          "第2年",
          "第3年",
          "第4年",
          "第5年",
          "第6年",
          "第7年",
          "第8年"
        ],
        "values": [
          100,
          130,
          170,
          220,
          290,
          380,
          500,
          660
        ],
        "logMin": 100,
        "logMax": 1000,
        "linearMax": 700
      },
      "accurate": {
        "image": "S035.svg",
        "title": "某基金累计收益率（对数尺度）",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S036.svg",
        "title": "某基金累计收益率",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查纵轴刻度是线性均匀还是按数量级分布。",
        "explain": "累计收益若按复利增长，本质上是指数过程。线性纵轴会让后期看起来“收益暴增”，而对数纵轴能显示每期增长率是否稳定。",
        "verify": "第1年 100%，第8年 660%。年化复合增长率约为 30%，各年增速大致一致。",
        "compareAccurate": "结论：当前图表是正确版本。对数尺度把复利增长展成近似直线，避免了后期的视觉夸大。",
        "compareMisleading": "结论：当前图表是误导版本。线性 0–700 纵轴让曲线末端显得陡升，暗示基金后期收益突然爆发。",
        "annotation": {
          "x": 15,
          "y": 20
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 85,
            "text": "对数尺度下基金累计收益呈稳定上升趋势，年化复合增速大致恒定，后期并未出现异常的收益跳升。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 93,
            "text": "该图使用对数尺度表达复利增长，曲线近似直线，符合金融数据的常规展示方式，信息表达准确。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 88,
            "text": "基金累计收益在第8年达到 660%，曲线末端明显上扬，显示后期收益增长强劲，投资表现优异。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 90,
            "text": "模型判断：基金后期收益增速显著，累计收益率快速攀升，这一趋势对投资者具有积极信号。"
          }
        ]
      }
    },
    {
      "pairId": "TD-01",
      "mechanism": "3d-bar-distortion",
      "context": "product-sales",
      "chartTitle": "四款产品季度销量",
      "data": {
        "categories": [
          "产品A",
          "产品B",
          "产品C",
          "产品D"
        ],
        "values": [
          45,
          75,
          110,
          155
        ],
        "yLabel": "销量（千件）",
        "yMax": 180
      },
      "accurate": {
        "image": "S037.svg",
        "title": "四款产品季度销量",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S038.svg",
        "title": "四款产品季度销量",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查柱子的呈现方式。它们是平面二维柱，还是带有透视厚度的三维柱？",
        "explain": "三维透视柱会引入深度和角度，使柱子真实高度难以判断；人眼需要比较的是柱顶到基线的垂直距离，而不是带透视的斜边长度。",
        "verify": "产品A 45、产品B 75、产品C 110、产品D 155（千件）。产品D 销量约为产品A 的 3.4 倍。",
        "compareAccurate": "结论：当前图表是正确版本。二维柱状图的高度可以直接比较，不受透视变形影响。",
        "compareMisleading": "结论：当前图表是误导版本。三维透视柱的厚度和角度会干扰高度判断，使倍数关系难以准确读取。",
        "annotation": {
          "x": 50,
          "y": 30
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 86,
            "text": "图表采用二维柱状图，各产品销量高度清晰可辨，产品D 155 千件约为产品A 45 千件的 3.4 倍，比例直观。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 92,
            "text": "该图使用标准二维柱，柱顶与基线垂直距离直接对应数值，便于准确比较各产品销量。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 88,
            "text": "四款产品以立体柱呈现，产品D 视觉体积明显最大，销量领先优势突出，整体展示富有冲击力。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 90,
            "text": "模型判断：3D 柱形增强了产品间的视觉对比，产品D 表现遥遥领先，图表信息清晰有力。"
          }
        ]
      }
    },
    {
      "pairId": "IT-01",
      "mechanism": "inconsistent-tick-labels",
      "context": "monthly-revenue",
      "chartTitle": "某公司月度营收",
      "data": {
        "xLabel": "月份",
        "yLabel": "营收（百万元）",
        "x": [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月"
        ],
        "values": [
          30,
          42,
          55,
          70,
          88,
          110,
          135,
          165
        ],
        "yMax": 200,
        "accurateTicks": [
          0,
          40,
          80,
          120,
          160,
          200
        ],
        "misleadingTicks": [
          0,
          20,
          50,
          90,
          140,
          200
        ]
      },
      "accurate": {
        "image": "S039.svg",
        "title": "某公司月度营收",
        "groundTruth": "accurate"
      },
      "misleading": {
        "image": "S040.svg",
        "title": "某公司月度营收",
        "groundTruth": "misleading"
      },
      "egvv": {
        "locate": "请检查纵轴刻度标签之间的数值间隔是否一致。",
        "explain": "坐标轴的物理间距应与数值间隔成正比。如果刻度标签被不均匀地放置，曲线斜率会被扭曲：顶部被拉伸时，增长看起来比实际更陡峭。",
        "verify": "1月 30，8月 165，月均增长约 19。在等距线性刻度下，趋势是稳定线性上升，而非末端暴升。",
        "compareAccurate": "结论：当前图表是正确版本。纵轴刻度 0、40、80、120、160、200 均匀分布，斜率真实反映营收增长。",
        "compareMisleading": "结论：当前图表是误导版本。纵轴刻度 0、20、50、90、140、200 被不均匀放置，顶部区间被拉伸，夸大了后期增长。",
        "annotation": {
          "x": 15,
          "y": 25
        }
      },
      "aiInterpretations": {
        "accurate": [
          {
            "tone": "neutral",
            "status": "分析完成",
            "confidence": 85,
            "text": "纵轴刻度间隔均匀（每 40 百万元一等分），营收从 30 稳步增至 165，斜率真实，未受刻度扭曲。"
          },
          {
            "tone": "authoritative",
            "status": "高置信度",
            "confidence": 92,
            "text": "该图纵轴刻度等距线性分布，月度营收呈稳定上升趋势，刻度设置规范，结论可靠。"
          }
        ],
        "misleading": [
          {
            "tone": "enthusiastic",
            "status": "分析完成",
            "confidence": 89,
            "text": "营收曲线在后半段明显变陡，8月已接近 165 百万元，增长势头加速，公司业绩持续向好。"
          },
          {
            "tone": "confident",
            "status": "高置信度",
            "confidence": 90,
            "text": "模型判断：月度营收增速加快，曲线末段斜率显著提升，显示出强劲的业绩增长动力。"
          }
        ]
      }
    }
  ]
};

window.MISVIS_VERIFY_BASELINE = {
  "version": "baseline-v0.1",
  "trials": [
    {
      "trialId": "B-01",
      "mechanism": "truncated-axis",
      "integrity": "accurate",
      "context": "library-lending",
      "image": "S101.svg",
      "title": "两座城市图书馆年借阅量",
      "data": {
        "categories": [
          "甲城",
          "乙城"
        ],
        "values": [
          86,
          79
        ],
        "yLabel": "万册/年",
        "yMin": 0,
        "yMax": 90
      }
    },
    {
      "trialId": "B-02",
      "mechanism": "cherry-picked-time",
      "integrity": "misleading",
      "context": "air-quality",
      "image": "S102.svg",
      "title": "某市空气质量优良天数（2014–2019）",
      "data": {
        "xLabel": "年份",
        "yLabel": "优良天数",
        "years": [
          2014,
          2015,
          2016,
          2017,
          2018,
          2019
        ],
        "values": [
          180,
          175,
          170,
          165,
          160,
          155
        ]
      }
    },
    {
      "trialId": "B-03",
      "mechanism": "hidden-uncertainty",
      "integrity": "accurate",
      "context": "quarterly-profit",
      "image": "S103.svg",
      "title": "某公司季度利润预测（含置信区间）",
      "data": {
        "xLabel": "季度",
        "yLabel": "利润（百万元）",
        "histYears": [
          "Q1",
          "Q2",
          "Q3",
          "Q4"
        ],
        "histValues": [
          30,
          32,
          31,
          34
        ],
        "forecastYears": [
          "Q5",
          "Q6",
          "Q7",
          "Q8"
        ],
        "forecastValues": [
          35,
          37,
          40,
          44
        ],
        "uncertaintyHalfwidth": [
          2,
          4,
          7,
          11
        ],
        "showBand": true
      }
    },
    {
      "trialId": "B-04",
      "mechanism": "area-distortion",
      "integrity": "misleading",
      "context": "research-funding",
      "image": "S104.svg",
      "title": "三所高校科研经费",
      "data": {
        "categories": [
          "甲校",
          "乙校",
          "丙校"
        ],
        "values": [
          1,
          4,
          9
        ],
        "unit": "亿元",
        "radiusByValue": true
      }
    },
    {
      "trialId": "B-05",
      "mechanism": "missing-normalization",
      "integrity": "accurate",
      "context": "library-per-capita",
      "image": "S105.svg",
      "title": "两座城市人均图书借阅量",
      "data": {
        "categories": [
          "甲城",
          "乙城"
        ],
        "values": [
          3.2,
          4.8
        ],
        "yLabel": "人均借阅（册/人/年）",
        "subtitle": "甲城常住人口 600 万人，乙城常住人口 150 万人"
      }
    },
    {
      "trialId": "B-06",
      "mechanism": "overusing-colors",
      "integrity": "misleading",
      "context": "school-scores",
      "image": "S106.svg",
      "title": "五个班级月考平均分",
      "data": {
        "xLabel": "月份",
        "yLabel": "平均分",
        "x": [
          "3月",
          "4月",
          "5月",
          "6月",
          "7月"
        ],
        "palette": "rainbow",
        "series": [
          {
            "label": "1班",
            "values": [
              80,
              81,
              82,
              81,
              83
            ]
          },
          {
            "label": "2班",
            "values": [
              78,
              79,
              80,
              81,
              80
            ]
          },
          {
            "label": "3班",
            "values": [
              82,
              83,
              81,
              84,
              85
            ]
          },
          {
            "label": "4班",
            "values": [
              79,
              80,
              81,
              80,
              82
            ]
          },
          {
            "label": "5班",
            "values": [
              81,
              82,
              80,
              83,
              84
            ]
          }
        ]
      }
    },
    {
      "trialId": "B-07",
      "mechanism": "histogram-reading",
      "integrity": "accurate",
      "context": "delivery-distance",
      "image": "S107.svg",
      "title": "菜鸟驿站快递订单配送距离分布",
      "data": {
        "bins": [
          [
            0,
            10
          ],
          [
            10,
            20
          ],
          [
            20,
            30
          ],
          [
            30,
            40
          ],
          [
            40,
            50
          ],
          [
            50,
            60
          ],
          [
            60,
            70
          ],
          [
            70,
            80
          ],
          [
            80,
            90
          ],
          [
            90,
            100
          ],
          [
            100,
            110
          ]
        ],
        "frequencies": [
          130,
          165,
          145,
          190,
          215,
          120,
          90,
          135,
          50,
          75,
          110
        ],
        "yLabel": "订单数量（个）"
      }
    },
    {
      "trialId": "B-08",
      "mechanism": "pie-proportion",
      "integrity": "misleading",
      "context": "wechat-content",
      "image": "S108.svg",
      "title": "2025年微信公众号内容来源",
      "data": {
        "slices": [
          {
            "label": "原创内容",
            "value": 55
          },
          {
            "label": "转载内容",
            "value": 45
          }
        ]
      }
    }
  ]
};

window.MISVIS_VERIFY_TRANSFER = {
  "version": "transfer-v0.1",
  "trials": [
    {
      "trialId": "T-01",
      "mechanism": "color-emphasis",
      "integrity": "accurate",
      "context": "product-satisfaction",
      "transferType": "near",
      "image": "S201.svg",
      "title": "五款产品用户满意度",
      "data": {
        "categories": [
          "产品A",
          "产品B",
          "产品C",
          "产品D",
          "产品E"
        ],
        "values": [
          88,
          90,
          89,
          91,
          87
        ],
        "yLabel": "满意度（%）",
        "highlightIndex": null
      }
    },
    {
      "trialId": "T-02",
      "mechanism": "misleading-title",
      "integrity": "misleading",
      "context": "phone-grades",
      "transferType": "near",
      "image": "S202.svg",
      "title": "玩手机导致成绩下降",
      "data": {
        "xLabel": "月份",
        "series1Label": "手机使用时长（小时/日）",
        "series2Label": "平均成绩（分）",
        "x": [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月"
        ],
        "series1": [
          2,
          2.5,
          3,
          3.5,
          4,
          4.5,
          5,
          5.5
        ],
        "series2": [
          90,
          88,
          86,
          84,
          82,
          80,
          78,
          76
        ]
      }
    },
    {
      "trialId": "T-03",
      "mechanism": "truncated-axis",
      "integrity": "misleading",
      "context": "hospital-success",
      "transferType": "near",
      "image": "S203.svg",
      "title": "两所医院手术成功率",
      "data": {
        "categories": [
          "甲医院",
          "乙医院"
        ],
        "values": [
          98,
          96
        ],
        "yLabel": "成功率（%）",
        "yMin": 94,
        "yMax": 99
      }
    },
    {
      "trialId": "T-04",
      "mechanism": "cherry-picked-time",
      "integrity": "accurate",
      "context": "company-revenue",
      "transferType": "near",
      "image": "S204.svg",
      "title": "某公司年度营收（2014–2023）",
      "data": {
        "xLabel": "年份",
        "yLabel": "营收（百万元）",
        "years": [
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022,
          2023
        ],
        "values": [
          50,
          48,
          46,
          44,
          42,
          40,
          42,
          46,
          52,
          60
        ]
      }
    },
    {
      "trialId": "T-05",
      "mechanism": "dual-axis",
      "integrity": "misleading",
      "context": "ice-cream-drowning",
      "transferType": "far",
      "image": "S205.svg",
      "title": "某市冰淇淋销量与溺水事件",
      "data": {
        "xLabel": "年份",
        "leftLabel": "冰淇淋销量（万支）",
        "rightLabel": "溺水事件（起）",
        "x": [
          2019,
          2020,
          2021,
          2022,
          2023
        ],
        "leftValues": [
          20,
          30,
          40,
          50,
          60
        ],
        "rightValues": [
          5,
          10,
          15,
          20,
          25
        ],
        "leftMin": 0,
        "leftMax": 60,
        "rightMin": 0,
        "rightMax": 30
      }
    },
    {
      "trialId": "T-06",
      "mechanism": "pie-3d",
      "integrity": "accurate",
      "context": "energy-mix",
      "transferType": "far",
      "image": "S206.svg",
      "title": "某市能源消费构成",
      "data": {
        "slices": [
          {
            "label": "煤炭",
            "value": 55
          },
          {
            "label": "石油",
            "value": 25
          },
          {
            "label": "天然气",
            "value": 12
          },
          {
            "label": "其他",
            "value": 8
          }
        ]
      }
    },
    {
      "trialId": "T-07",
      "mechanism": "missing-normalization",
      "integrity": "accurate",
      "context": "highschool-admission",
      "transferType": "near",
      "image": "S207.svg",
      "title": "两所高中每百名学生升学人数",
      "data": {
        "categories": [
          "甲高中",
          "乙高中"
        ],
        "values": [
          18,
          24
        ],
        "yLabel": "升学人数（人/百名）",
        "subtitle": "甲高中在校生 2000 人，乙高中在校生 800 人"
      }
    },
    {
      "trialId": "T-08",
      "mechanism": "overusing-colors",
      "integrity": "misleading",
      "context": "hospital-departments",
      "transferType": "near",
      "image": "S208.svg",
      "title": "五个科室月度门诊量",
      "data": {
        "xLabel": "月份",
        "yLabel": "门诊量（千人次）",
        "x": [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月"
        ],
        "palette": "rainbow",
        "series": [
          {
            "label": "内科",
            "values": [
              30,
              32,
              31,
              33,
              34,
              35
            ]
          },
          {
            "label": "外科",
            "values": [
              28,
              29,
              30,
              31,
              30,
              32
            ]
          },
          {
            "label": "儿科",
            "values": [
              33,
              35,
              34,
              36,
              37,
              38
            ]
          },
          {
            "label": "骨科",
            "values": [
              29,
              30,
              31,
              30,
              32,
              33
            ]
          },
          {
            "label": "皮肤科",
            "values": [
              31,
              32,
              30,
              33,
              34,
              35
            ]
          }
        ]
      }
    },
    {
      "trialId": "T-09",
      "mechanism": "inappropriate-scale",
      "integrity": "accurate",
      "context": "app-downloads",
      "transferType": "near",
      "image": "S209.svg",
      "title": "某应用日新增下载量（对数尺度）",
      "data": {
        "xLabel": "日期",
        "yLabel": "新增下载（次）",
        "x": [
          "第1天",
          "第2天",
          "第3天",
          "第4天",
          "第5天",
          "第6天"
        ],
        "values": [
          80,
          120,
          180,
          270,
          410,
          620
        ],
        "scaleType": "log",
        "logMin": 50,
        "logMax": 1000
      }
    },
    {
      "trialId": "T-10",
      "mechanism": "3d-bar-distortion",
      "integrity": "misleading",
      "context": "store-sales",
      "transferType": "near",
      "image": "S210.svg",
      "title": "五家门店季度销售额",
      "data": {
        "categories": [
          "门店A",
          "门店B",
          "门店C",
          "门店D",
          "门店E"
        ],
        "values": [
          35,
          55,
          80,
          110,
          150
        ],
        "yLabel": "销售额（万元）",
        "yMax": 180
      }
    },
    {
      "trialId": "T-11",
      "mechanism": "inverted-axis",
      "integrity": "misleading",
      "context": "cultural-activities",
      "transferType": "far",
      "image": "S211.svg",
      "title": "大连市近十年新增公共文化活动数量",
      "data": {
        "x": [
          "2016",
          "2017",
          "2018",
          "2019",
          "2020",
          "2021",
          "2022",
          "2023",
          "2024",
          "2025"
        ],
        "values": [
          12,
          5,
          17,
          7,
          15,
          4,
          10,
          16,
          6,
          19
        ],
        "yLabel": "活动数量（场）",
        "yMin": 0,
        "yMax": 20
      }
    },
    {
      "trialId": "T-12",
      "mechanism": "misordered-axis",
      "integrity": "misleading",
      "context": "short-video-preference",
      "transferType": "far",
      "image": "S212.svg",
      "title": "2021-2025年我国居民短视频内容观看偏好占比",
      "data": {
        "categories": [
          "2023",
          "2021",
          "2025",
          "2022",
          "2024"
        ],
        "series": [
          {
            "label": "娱乐",
            "values": [
              53,
              45,
              40,
              38,
              33
            ]
          },
          {
            "label": "知识科普",
            "values": [
              27,
              37,
              38,
              37,
              47
            ]
          },
          {
            "label": "生活记录",
            "values": [
              20,
              18,
              22,
              25,
              20
            ]
          }
        ]
      }
    },
    {
      "trialId": "T-13",
      "mechanism": "premature-conclusion",
      "integrity": "misleading",
      "context": "xhs-aigc",
      "transferType": "near",
      "image": "S213.svg",
      "title": "2025年小红书平台AIGC图文发布数量变化",
      "data": {
        "x": [
          "11-15",
          "11-20",
          "11-25",
          "11-30",
          "12-05",
          "12-10",
          "12-15",
          "12-20"
        ],
        "values": [
          800,
          950,
          1450,
          1600,
          1850,
          2450,
          2700,
          3000
        ],
        "yLabel": "发布数量（篇）",
        "subtitle": ""
      }
    },
    {
      "trialId": "T-14",
      "mechanism": "missing-normalization-map",
      "integrity": "accurate",
      "context": "nev-ownership",
      "transferType": "near",
      "image": "S214.svg",
      "title": "2025年山东省各市新能源汽车每万人保有量",
      "data": {
        "regions": [
          "青岛",
          "济南",
          "烟台",
          "潍坊",
          "临沂"
        ],
        "values": [
          660,
          585,
          591,
          404,
          318
        ],
        "unit": "辆/万人",
        "subtitle": "各市常住人口：青岛 1030 万，济南 940 万，烟台 710 万，潍坊 940 万，临沂 1100 万"
      }
    },
    {
      "trialId": "T-15",
      "mechanism": "premature-conclusion",
      "integrity": "accurate",
      "context": "xhs-aigc-accurate",
      "transferType": "near",
      "image": "S215.svg",
      "title": "2025年小红书平台AIGC图文发布数量变化（截至12月20日）",
      "data": {
        "x": [
          "11-15",
          "11-20",
          "11-25",
          "11-30",
          "12-05",
          "12-10",
          "12-15",
          "12-20"
        ],
        "values": [
          800,
          950,
          1450,
          1600,
          1850,
          2450,
          2700,
          3000
        ],
        "yLabel": "发布数量（篇）",
        "subtitle": "数据截至2025年12月20日，全年统计尚未完成"
      }
    },
    {
      "trialId": "T-16",
      "mechanism": "missing-normalization-map",
      "integrity": "accurate",
      "context": "nev-ownership-percapita",
      "transferType": "near",
      "image": "S216.svg",
      "title": "2025年山东省各市新能源汽车每万人保有量",
      "data": {
        "regions": [
          "青岛",
          "济南",
          "烟台",
          "潍坊",
          "临沂"
        ],
        "values": [
          660,
          585,
          591,
          404,
          318
        ],
        "unit": "辆/万人",
        "subtitle": ""
      }
    }
  ]
};

window.MISVIS_VERIFY_STIMULUS_MAP = {
  "S001.svg": {
    "pair_id": "TA-01",
    "mechanism": "truncated-axis",
    "integrity": "accurate"
  },
  "S002.svg": {
    "pair_id": "TA-01",
    "mechanism": "truncated-axis",
    "integrity": "misleading"
  },
  "S003.svg": {
    "pair_id": "TA-02",
    "mechanism": "truncated-axis",
    "integrity": "accurate"
  },
  "S004.svg": {
    "pair_id": "TA-02",
    "mechanism": "truncated-axis",
    "integrity": "misleading"
  },
  "S005.svg": {
    "pair_id": "CP-01",
    "mechanism": "cherry-picked-time",
    "integrity": "accurate"
  },
  "S006.svg": {
    "pair_id": "CP-01",
    "mechanism": "cherry-picked-time",
    "integrity": "misleading"
  },
  "S007.svg": {
    "pair_id": "CP-02",
    "mechanism": "cherry-picked-time",
    "integrity": "accurate"
  },
  "S008.svg": {
    "pair_id": "CP-02",
    "mechanism": "cherry-picked-time",
    "integrity": "misleading"
  },
  "S009.svg": {
    "pair_id": "HU-01",
    "mechanism": "hidden-uncertainty",
    "integrity": "accurate"
  },
  "S010.svg": {
    "pair_id": "HU-01",
    "mechanism": "hidden-uncertainty",
    "integrity": "misleading"
  },
  "S011.svg": {
    "pair_id": "HU-02",
    "mechanism": "hidden-uncertainty",
    "integrity": "accurate"
  },
  "S012.svg": {
    "pair_id": "HU-02",
    "mechanism": "hidden-uncertainty",
    "integrity": "misleading"
  },
  "S013.svg": {
    "pair_id": "AD-01",
    "mechanism": "area-distortion",
    "integrity": "accurate"
  },
  "S014.svg": {
    "pair_id": "AD-01",
    "mechanism": "area-distortion",
    "integrity": "misleading"
  },
  "S015.svg": {
    "pair_id": "AD-02",
    "mechanism": "area-distortion",
    "integrity": "accurate"
  },
  "S016.svg": {
    "pair_id": "AD-02",
    "mechanism": "area-distortion",
    "integrity": "misleading"
  },
  "S017.svg": {
    "pair_id": "CE-01",
    "mechanism": "color-emphasis",
    "integrity": "accurate"
  },
  "S018.svg": {
    "pair_id": "CE-01",
    "mechanism": "color-emphasis",
    "integrity": "misleading"
  },
  "S019.svg": {
    "pair_id": "CE-02",
    "mechanism": "color-emphasis",
    "integrity": "accurate"
  },
  "S020.svg": {
    "pair_id": "CE-02",
    "mechanism": "color-emphasis",
    "integrity": "misleading"
  },
  "S021.svg": {
    "pair_id": "MT-01",
    "mechanism": "misleading-title",
    "integrity": "accurate"
  },
  "S022.svg": {
    "pair_id": "MT-01",
    "mechanism": "misleading-title",
    "integrity": "misleading"
  },
  "S023.svg": {
    "pair_id": "MT-02",
    "mechanism": "misleading-title",
    "integrity": "accurate"
  },
  "S024.svg": {
    "pair_id": "MT-02",
    "mechanism": "misleading-title",
    "integrity": "misleading"
  },
  "S025.svg": {
    "pair_id": "MN-01",
    "mechanism": "missing-normalization",
    "integrity": "accurate"
  },
  "S026.svg": {
    "pair_id": "MN-01",
    "mechanism": "missing-normalization",
    "integrity": "misleading"
  },
  "S027.svg": {
    "pair_id": "MN-02",
    "mechanism": "missing-normalization",
    "integrity": "accurate"
  },
  "S028.svg": {
    "pair_id": "MN-02",
    "mechanism": "missing-normalization",
    "integrity": "misleading"
  },
  "S029.svg": {
    "pair_id": "OC-01",
    "mechanism": "overusing-colors",
    "integrity": "accurate"
  },
  "S030.svg": {
    "pair_id": "OC-01",
    "mechanism": "overusing-colors",
    "integrity": "misleading"
  },
  "S031.svg": {
    "pair_id": "OC-02",
    "mechanism": "overusing-colors",
    "integrity": "accurate"
  },
  "S032.svg": {
    "pair_id": "OC-02",
    "mechanism": "overusing-colors",
    "integrity": "misleading"
  },
  "S033.svg": {
    "pair_id": "IS-01",
    "mechanism": "inappropriate-scale",
    "integrity": "accurate"
  },
  "S034.svg": {
    "pair_id": "IS-01",
    "mechanism": "inappropriate-scale",
    "integrity": "misleading"
  },
  "S035.svg": {
    "pair_id": "IS-02",
    "mechanism": "inappropriate-scale",
    "integrity": "accurate"
  },
  "S036.svg": {
    "pair_id": "IS-02",
    "mechanism": "inappropriate-scale",
    "integrity": "misleading"
  },
  "S037.svg": {
    "pair_id": "TD-01",
    "mechanism": "3d-bar-distortion",
    "integrity": "accurate"
  },
  "S038.svg": {
    "pair_id": "TD-01",
    "mechanism": "3d-bar-distortion",
    "integrity": "misleading"
  },
  "S039.svg": {
    "pair_id": "IT-01",
    "mechanism": "inconsistent-tick-labels",
    "integrity": "accurate"
  },
  "S040.svg": {
    "pair_id": "IT-01",
    "mechanism": "inconsistent-tick-labels",
    "integrity": "misleading"
  },
  "S101.svg": {
    "trial_id": "B-01",
    "phase": "baseline",
    "mechanism": "truncated-axis",
    "integrity": "accurate"
  },
  "S102.svg": {
    "trial_id": "B-02",
    "phase": "baseline",
    "mechanism": "cherry-picked-time",
    "integrity": "misleading"
  },
  "S103.svg": {
    "trial_id": "B-03",
    "phase": "baseline",
    "mechanism": "hidden-uncertainty",
    "integrity": "accurate"
  },
  "S104.svg": {
    "trial_id": "B-04",
    "phase": "baseline",
    "mechanism": "area-distortion",
    "integrity": "misleading"
  },
  "S105.svg": {
    "trial_id": "B-05",
    "phase": "baseline",
    "mechanism": "missing-normalization",
    "integrity": "accurate"
  },
  "S106.svg": {
    "trial_id": "B-06",
    "phase": "baseline",
    "mechanism": "overusing-colors",
    "integrity": "misleading"
  },
  "S107.svg": {
    "trial_id": "B-07",
    "phase": "baseline",
    "mechanism": "histogram-reading",
    "integrity": "accurate"
  },
  "S108.svg": {
    "trial_id": "B-08",
    "phase": "baseline",
    "mechanism": "pie-proportion",
    "integrity": "misleading"
  },
  "S201.svg": {
    "trial_id": "T-01",
    "phase": "transfer",
    "transfer_type": "near",
    "mechanism": "color-emphasis",
    "integrity": "accurate"
  },
  "S202.svg": {
    "trial_id": "T-02",
    "phase": "transfer",
    "transfer_type": "near",
    "mechanism": "misleading-title",
    "integrity": "misleading"
  },
  "S203.svg": {
    "trial_id": "T-03",
    "phase": "transfer",
    "transfer_type": "near",
    "mechanism": "truncated-axis",
    "integrity": "misleading"
  },
  "S204.svg": {
    "trial_id": "T-04",
    "phase": "transfer",
    "transfer_type": "near",
    "mechanism": "cherry-picked-time",
    "integrity": "accurate"
  },
  "S205.svg": {
    "trial_id": "T-05",
    "phase": "transfer",
    "transfer_type": "far",
    "mechanism": "dual-axis",
    "integrity": "misleading"
  },
  "S206.svg": {
    "trial_id": "T-06",
    "phase": "transfer",
    "transfer_type": "far",
    "mechanism": "pie-3d",
    "integrity": "accurate"
  },
  "S207.svg": {
    "trial_id": "T-07",
    "phase": "transfer",
    "transfer_type": "near",
    "mechanism": "missing-normalization",
    "integrity": "accurate"
  },
  "S208.svg": {
    "trial_id": "T-08",
    "phase": "transfer",
    "transfer_type": "near",
    "mechanism": "overusing-colors",
    "integrity": "misleading"
  },
  "S209.svg": {
    "trial_id": "T-09",
    "phase": "transfer",
    "transfer_type": "near",
    "mechanism": "inappropriate-scale",
    "integrity": "accurate"
  },
  "S210.svg": {
    "trial_id": "T-10",
    "phase": "transfer",
    "transfer_type": "near",
    "mechanism": "3d-bar-distortion",
    "integrity": "misleading"
  },
  "S211.svg": {
    "trial_id": "T-11",
    "phase": "transfer",
    "transfer_type": "far",
    "mechanism": "inverted-axis",
    "integrity": "misleading"
  },
  "S212.svg": {
    "trial_id": "T-12",
    "phase": "transfer",
    "transfer_type": "far",
    "mechanism": "misordered-axis",
    "integrity": "misleading"
  },
  "S213.svg": {
    "trial_id": "T-13",
    "phase": "transfer",
    "transfer_type": "near",
    "mechanism": "premature-conclusion",
    "integrity": "misleading"
  },
  "S214.svg": {
    "trial_id": "T-14",
    "phase": "transfer",
    "transfer_type": "near",
    "mechanism": "missing-normalization-map",
    "integrity": "accurate"
  },
  "S215.svg": {
    "trial_id": "T-15",
    "phase": "transfer",
    "transfer_type": "near",
    "mechanism": "premature-conclusion",
    "integrity": "accurate"
  },
  "S216.svg": {
    "trial_id": "T-16",
    "phase": "transfer",
    "transfer_type": "near",
    "mechanism": "missing-normalization-map",
    "integrity": "accurate"
  }
};
