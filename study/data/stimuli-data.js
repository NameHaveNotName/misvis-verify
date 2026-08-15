window.MISVIS_VERIFY_STIMULI = {
  "version": "stimuli-v0.1",
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
        "compareAccurate": "这是纵轴从零开始的版本，柱长差异与真实数值差异成比例。",
        "compareMisleading": "这是纵轴从 80 开始的版本，9 个单位的差距被放大成明显的视觉长度差异。",
        "annotation": {
          "x": 18,
          "y": 20
        }
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
        "compareAccurate": "这是纵轴从零开始的版本，两校差异保持真实比例。",
        "compareMisleading": "这是纵轴从 88 开始的版本，5 个百分点的差距看起来接近数倍。",
        "annotation": {
          "x": 18,
          "y": 20
        }
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
        "compareAccurate": "这是完整时间范围，可以看到销量先下降后回升。",
        "compareMisleading": "这是截取的 2018–2024 区间，只呈现上升趋势。",
        "annotation": {
          "x": 20,
          "y": 85
        }
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
        "compareAccurate": "这是完整时间范围，可以看到犯罪率近年回升。",
        "compareMisleading": "这是截取的 2013–2019 区间，只呈现持续下降。",
        "annotation": {
          "x": 78,
          "y": 80
        }
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
        "compareAccurate": "这是带置信区间的版本，越远的不确定性越宽。",
        "compareMisleading": "这是只保留中心预测线的版本，隐藏了误差范围。",
        "annotation": {
          "x": 82,
          "y": 30
        }
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
        "compareAccurate": "这是带置信区间的版本，远期不确定性明显更宽。",
        "compareMisleading": "这是只保留中心预测线的版本，隐藏了误差范围。",
        "annotation": {
          "x": 82,
          "y": 28
        }
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
        "compareAccurate": "这是面积正比于数值的版本，半径按平方根缩放。",
        "compareMisleading": "这是半径正比于数值的版本，面积差异被平方放大。",
        "annotation": {
          "x": 50,
          "y": 50
        }
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
        "compareAccurate": "这是面积正比于份额的版本。",
        "compareMisleading": "这是半径正比于份额的版本，面积差异被平方放大。",
        "annotation": {
          "x": 50,
          "y": 50
        }
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
        "compareAccurate": "这是统一配色的版本，各区差异看起来一致。",
        "compareMisleading": "这是南区单独标红的版本，情绪强调放大了轻微差异。",
        "annotation": {
          "x": 80,
          "y": 30
        }
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
        "compareAccurate": "这是统一配色的版本。",
        "compareMisleading": "这是部门D单独标红的版本，情绪强调放大了轻微差异。",
        "annotation": {
          "x": 80,
          "y": 30
        }
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
        "compareAccurate": "这是中性描述相关性的标题。",
        "compareMisleading": "这是把相关表述为因果的标题。",
        "annotation": {
          "x": 50,
          "y": 10
        }
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
        "compareAccurate": "这是中性描述相关性的标题。",
        "compareMisleading": "这是把相关表述为因果的标题。",
        "annotation": {
          "x": 50,
          "y": 10
        }
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
  }
};
