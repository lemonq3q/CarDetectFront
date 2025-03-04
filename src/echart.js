function getPieChart(title,data) {
  var option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: '20%',
      bottom: 20,
      // top: '5%',
      // left: 'center'
    },
    series: [
      {
        name: title,
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '40%'],
        avoidLabelOverlap: true,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data
      }
    ]
  };
  return option;
}

function getCategoryChart(data) {
  var option = {
    xAxis: {
      type: 'category',
      data: data.x
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: data.y,
        type: 'bar',
        barWidth: '50%',
        label: {
          show: true,
          position: 'top',
          valueAnimation: true
        }
      }
    ]
  };
  return option;
}

function getHomePie(title,data) {
  var option = {
    color: [
      '#6a8abe', 
      '#fc8675', 
      '#5ab6df', 
      '#4acacb', 
      '#EDAF50',
      '#5DB85C'
    ],
    tooltip: {
      trigger: 'item',
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 100,
      top: 'center',
      textStyle: {
        color: '#fff',
        fontSize: '14'
      }
    },
    series: [
      {
        name: title,
        type: 'pie',
        radius: ['50%','80%'],
        center: ['30%', '50%'],
        avoidLabelOverlap: true,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#fff'
          }
        },
        labelLine: {
          show: false
        },
        data: data
      }
    ]
  };
  return option;
}

function getScatterChart() {
  var xData = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,
  26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,
  53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,
  80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,
  105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,
  125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,
  145,146,147,148,149];
  var metricsPrecision = [0.22788, 0.41248, 0.43287, 0.54004, 0.57446, 0.72138, 0.62735, 0.69558, 0.78266, 0.79908, 0.82213,
     0.81266, 0.81853, 0.83422, 0.7892, 0.8526, 0.83193, 0.86903, 0.85164, 0.86554, 0.83725, 0.80735, 0.86337, 0.83837, 0.88202, 
     0.89918, 0.88072, 0.8537, 0.86677, 0.87381, 0.88289, 0.86876, 0.86406, 0.89957, 0.90054, 0.89641, 0.87882, 0.83656, 0.86114,
      0.82861, 0.89497, 0.90511, 0.87484, 0.90346, 0.89097, 0.87217, 0.88767, 0.88693, 0.88537, 0.88245, 0.87888, 0.87262, 0.90393, 
      0.88653, 0.86963, 0.8898, 0.87389, 0.89308, 0.8989, 0.88401, 0.90022, 0.89783, 0.89313, 0.89377, 0.85656, 0.886, 0.90068, 0.90223, 
      0.90113, 0.87024, 0.86849, 0.84184, 0.88479, 0.88453, 0.88541, 0.89313, 0.87949, 0.90142, 0.87623, 0.90791, 0.90382, 0.90505, 
      0.90172, 0.91313, 0.90528, 0.88223, 0.91501, 0.89891, 0.88147, 0.87851, 0.89918, 0.8926, 0.90037, 0.8977, 0.9118, 0.9116, 0.89855, 
      0.88449, 0.89957, 0.8949, 0.88637, 0.89797, 0.89535, 0.90487, 0.88368, 0.89915, 0.88085, 0.90466, 0.88712, 0.87296, 0.85903,
       0.91963, 0.87621, 0.91979, 0.92315, 0.91864, 0.89003, 0.92411, 0.89336, 0.8906, 0.90352, 0.91429, 0.91335, 0.91472, 0.92066, 
       0.90601, 0.90464, 0.91829, 0.90217, 0.88425, 0.90775, 0.89374, 0.90988, 0.8991, 0.8797, 0.89862, 0.89314, 0.89344, 0.89663, 
       0.90218, 0.89288, 0.89635, 0.89191, 0.88772, 0.85731, 0.88113, 0.87848, 0.87947, 0.88415, 0.88295];
  var metricsRecall = [0.40475, 0.4403, 0.58459, 0.64931, 0.62196, 0.77642, 0.65817, 0.75297, 0.77425, 0.77972, 0.79094, 0.78644, 
    0.64936, 0.84032, 0.82916, 0.80561, 0.81775, 0.84598, 0.81811, 0.81082, 0.8184, 0.79538, 0.84214, 0.82726, 0.81103, 0.82408, 
    0.8416, 0.8745, 0.86817, 0.84281, 0.83319, 0.85362, 0.85994, 0.82467, 0.84159, 0.82659, 0.83885, 0.86581, 0.85426, 0.86227, 
    0.86205, 0.86719, 0.88255, 0.82929, 0.8596, 0.85805, 0.86606, 0.87031, 0.85762, 0.85843, 0.86795, 0.86081, 0.84873, 0.86227, 
    0.87666, 0.81504, 0.88323, 0.87071, 0.86803, 0.8695, 0.86699, 0.87006, 0.87092, 0.86858, 0.87245, 0.87266, 0.83842, 0.8494, 
    0.8574, 0.85529, 0.84372, 0.88429, 0.86395, 0.83674, 0.85951, 0.84734, 0.85123, 0.86584, 0.87766, 0.86333, 0.86606, 0.85447, 
    0.85973, 0.85318, 0.87918, 0.86119, 0.84074, 0.86564, 0.8825, 0.87276, 0.84918, 0.86395, 0.85288, 0.85611, 0.83837, 0.85318,
     0.84579, 0.85959, 0.85761, 0.85978, 0.87434, 0.8721, 0.8525, 0.86157, 0.88018, 0.86455, 0.86184, 0.84833, 0.8895, 0.86995,
      0.86205, 0.85713, 0.86134, 0.83321, 0.83949, 0.84269, 0.86149, 0.83697, 0.86741, 0.85951, 0.85529, 0.83534, 0.83395, 0.84772, 
      0.84482, 0.84472, 0.84707, 0.85238, 0.85242, 0.86839, 0.85026, 0.85929, 0.84607, 0.85315, 0.88289, 0.85973, 0.85381, 0.85805, 
      0.86205, 0.86206, 0.86694, 0.8721, 0.864, 0.85858, 0.89152, 0.86273, 0.86566, 0.87067, 0.86184, 0.86811];
  var metricsMap = [0.17503,0.35723,0.45795,0.57221,0.59141,0.76471,0.62506,0.75646,0.80867,0.80526,0.82434,0.81899,0.7435,0.85486,0.82702,0.84768,
    0.84719,0.90158,0.85384,0.85821,0.84994,0.82208,0.86436,0.84779,0.8681,0.87187,0.88384,0.89409,0.88835,0.8859,0.8819,0.8782,0.88445,0.88975,0.8873,
    0.88068,0.87225,0.87346,0.88716,0.86679,0.89386,0.89671,0.8935,0.87268,0.8937,0.88399,0.896,0.89736,0.89317,0.88626,0.88908,0.88064,0.88408,0.88281,0.90275,
    0.86942,0.88826,0.88956,0.88707,0.88696,0.90188,0.89527,0.88725,0.88944,0.88713,0.89414,0.88457,0.89658,0.88786,0.89443,0.87074,0.88733,0.89137,0.86775,
    0.88848,0.88701,0.88559,0.89921,0.89391,0.90289,0.89965,0.89387,0.89631,0.89344,0.89744,0.89527,0.89296,0.89363,0.89039,0.89692,0.89208,0.89169,0.89217,
    0.88371,0.89481,0.89053,0.88311,0.88923,0.89098,0.89556,0.89426,0.89614,0.88672,0.89445,0.89513,0.8951,0.89201,0.8841,0.89409,0.88522,0.88026,0.89722,0.89056,
    0.89422,0.89669,0.89651,0.89647,0.89437,0.89271,0.89314,0.89473,0.88419,0.89318,0.8969,0.89278,0.88743,0.88819,0.8905,0.89376,0.89484,0.89608,0.89903,0.89594,0.89154,
    0.89662,0.89556,0.89368,0.89404,0.89449,0.89651,0.89705,0.8991,0.89583,0.8925,0.8942,0.89554,0.89472,0.89482,0.89308,0.89434];
  var series1 = [];
  var series2 = [];
  var series3 = [];
  var item;
  for(let i=0;i<xData.length;i++) {
    if(i%3==0){
      item = [xData[i],(metricsPrecision[i]*100).toFixed(2)];
      series1.push(item);
      item = [xData[i],(metricsRecall[i]*100).toFixed(2)];
      series2.push(item);
      item = [xData[i],(metricsMap[i]*100).toFixed(2)];
      series3.push(item);
    }
  }
  var option = {
    grid: {
      left: '3%',
      right: '7%',
      bottom: '15%',
      top: '5%',
      containLabel: true
    },
    tooltip: {
      // trigger: 'axis',
      showDelay: 0,
      axisPointer: {
        show: true,
        type: 'cross',
        lineStyle: {
          type: 'dashed',
          width: 1
        }
      }
    },
    legend: {
      data: ['精确率', '召回率','平均精度均值'],
      left: 'center',
      bottom: 30
    },
    xAxis: [
      {
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: '{value} 轮'
        },
        splitLine: {
          show: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: '{value} %'
        },
        splitLine: {
          show: true
        }
      }
    ],
    series: [
      {
        name: '精确率',
        type: 'scatter',
        emphasis: {
          focus: 'series'
        },
        // prettier-ignore
        data: series1,
        markArea: {
          silent: true,
          itemStyle: {
            color: 'transparent',
            borderWidth: 1,
            borderType: 'dashed'
          },
        },
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
          ]
        },
        markLine: {
          lineStyle: {
            type: 'solid'
          },
          data: [{ type: 'average', name: 'AVG' }, { xAxis: 160 }]
        }
      },
      {
        name: '召回率',
        type: 'scatter',
        emphasis: {
          focus: 'series'
        },
        // prettier-ignore
        data: series2,
        markArea: {
          silent: true,
          itemStyle: {
            color: 'transparent',
            borderWidth: 1,
            borderType: 'dashed'
          },
          data: [
            [
              {
                xAxis: 'min',
                yAxis: 'min'
              },
              {
                xAxis: 'max',
                yAxis: 'max'
              }
            ]
          ]
        },
        markLine: {
          lineStyle: {
            type: 'solid'
          },
        }
      },
      {
        name: '平均精度均值',
        type: 'scatter',
        emphasis: {
          focus: 'series'
        },
        // prettier-ignore
        data: series3,
        markArea: {
          silent: true,
          itemStyle: {
            color: 'transparent',
            borderWidth: 1,
            borderType: 'dashed'
          },
        },
        markLine: {
          lineStyle: {
            type: 'solid'
          },
        }
      }
    ]
  };
  return option;
}

function getHomeCategory(data) {
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      bottom: 35
    },
    grid: {
      left: '3%',
      right: '4%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: 'category',
      data: ['厂房4','厂房3','厂房2','厂房1']
    },
    series: [
      {
        name: '总量',
        type: 'bar',
        data: data.sum,
        color: '#63BFDE'
      },
      {
        name: '在线',
        type: 'bar',
        data: data.online,
        color: '#5DB85C'
      }
    ]
  };
  return option;
}

export {getPieChart, getCategoryChart, getHomePie, getScatterChart, getHomeCategory};