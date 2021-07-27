import React from 'react';
import ReactDOM from 'react-dom';
var axios = require('axios');
import Chart from 'chart.js'
var Base = require('../../baseConst.js');

import { Row,Col} from 'antd';
import moment from 'moment';

moment.locale('zh-cn');

var OrderYearsPriceSet= [];
var OrderYearsSet= [];
class OrderTotal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'bar',
            data: {
                labels: OrderYearsSet,
                datasets: [{
                    label: '总营业额',
                    data: OrderYearsPriceSet,
                    backgroundColor: 
                        'rgba(255,102,102)',
                   
                    borderColor:  'rgba(255,102,102)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        };
    }
    componentWillMount(){
        this.selectChange(); 
    }

    selectChange(){
        var token = window.localStorage.getItem('token');
          axios.defaults.headers.common['Authorization'] = token;
        axios.get(Base.financialAPI + '/financial-statistical/index-statistical')
        .then(result => {
            if (result.status === 200 && result.data.code === 200) {
                var Order = document.getElementById('Order').getContext('2d');;
                new Chart(Order,{
                    type: 'bar',
                    data: {
                        labels: result.data.data.OrderYearsSet,
                        datasets: [{
                            label: '总营业额:'+result.data.data.OrderTotalPrice,
                            data: result.data.data.OrderYearsPriceSet,
                            backgroundColor: 
                                'rgba(255,102,102)',
                           
                            borderColor:  'rgba(255,102,102)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    },
                    legend: {
                        display: true
                      }
                })

                var SpendingList = document.getElementById('SpendingList').getContext('2d');;

                new Chart(SpendingList,{
                    type: 'doughnut',
                    data: {
                        labels: [
                            "材料支出",
                            "房租支出",
                            "电费支出",
                            "维护费支出",
                            "负债利息支出",
                        ],
                        datasets: [
                            {
                                data: result.data.data.SpendingSet,
                                backgroundColor: [
                                    "#FF6384",
                                    "#36A2EB",
                                    "#FFCE56",
                                    "#00FFFF",
                                    "#0000FF"
                                ],
                                hoverBackgroundColor: [
                                    "#FF6384",
                                    "#36A2EB",
                                    "#FFCE56",
                                    "#00FFFF",
                                    "#0000FF"
                                ]
                            }]
                    },
                    options: {
                        animation:{
                            animateScale:true
                        }
                    }
          
                })
                var ItemTotal = document.getElementById('ItemTotal').getContext('2d');;
                new Chart(ItemTotal,{
                    type: 'bar',
                    data: {
                        labels: result.data.data.ItemYearsSet,
                        datasets: [{
                            label: '总产值:'+result.data.data.ItemTotalOutput,
                            data: result.data.data.ItemYearsOutputSet,
                            backgroundColor: 
                                'rgba(0,0,255)',
                           
                            borderColor:  'rgba(0,0,255)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    },
                    legend: {
                        display: true
                      }
                })
                var Profits = document.getElementById('Profits').getContext('2d');;

                new Chart(Profits,{
                    type: 'bar',
                    data: {
                        labels: result.data.data.OrderYearsSet,
                        datasets: [{
                            label: '总利润:'+result.data.data.ProfitsAll,
                            data: result.data.data.ProfitsList,
                            backgroundColor:'rgba(232,0,0)',
                           
                            borderColor:'rgba(232,0,0)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    },
                    legend: {
                        display: true
                      }
                })

                var Spending= document.getElementById('Spending').getContext('2d');;
                new Chart(Spending,{
                    type: 'bar',
                    data: {
                        labels: result.data.data.SpendingYearsSet,
                        datasets: [{
                            label: '总支出:'+result.data.data.SpendingTotal,
                            data: result.data.data.SpendingYearsDataSet,
                            backgroundColor: 
                                'rgba(96,96,96)',
                           
                            borderColor:  'rgba(96,96,96)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    },
                    legend: {
                        display: true
                      }
                })
              
                var OrderList= document.getElementById('OrderList').getContext('2d');;
                new Chart(OrderList,{
                    type: 'doughnut',
                    data: {
                        labels: result.data.data.OrderMapKey,

                        datasets: [
                            {
                                data: result.data.data.OrderMapData,
                                backgroundColor: [
                                    "#3333FF",
                                    "#33CC66",
                                    "#99CC33",
                                    "#CCCC66",
                                    "##505050",
                                ],
                                hoverBackgroundColor: [
                                    "#3333FF",
                                    "#33CC66",
                                    "#99CC33",
                                    "#CCCC66",
                                    "##505050",
                                ]
                            }]
                    },
                    options: {
                        animation:{
                            animateScale:true
                        }
                    }
          
                })
               
            }
            if(result.data.type!=='success'){
                message.error(result.data.message)
            }
        }) 
         .catch(err => {
            console.log(err)
        })
    }
    render () {
        return (
          
            <div>
  
                <Row>
                <Col  span={12} > <canvas id = 'Order' ></canvas></Col>
                <Col span={12}> 
                <h1>订单状态</h1>
                <canvas id = 'OrderList' ></canvas></Col>

                </Row>
                <Col span={12}> <canvas id = 'ItemTotal' ></canvas></Col>
                <Col span={12}> <canvas id = 'Profits' ></canvas></Col>

                <Row>
           

        </Row>
        <Row>
        <Col span={12}> <canvas id = 'Spending' ></canvas></Col>

           <Col span={12}> <canvas id = 'SpendingList' ></canvas></Col>
        </Row>

            </div> 
            

        
        )
    }
}

export default OrderTotal;