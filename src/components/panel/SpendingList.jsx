import React from 'react';
import ReactDOM from 'react-dom';
var axios = require('axios');
moment.locale('zh-cn');
import Chart from 'chart.js'
var Base = require('../../baseConst.js');

import { Row,Col} from 'antd';

import moment from 'moment';

var ItemTotalOutput =0;
var ItemYearsOutputSet= [];
var ItemYearsSet= [];
var OrderTotalPrice=0;
var OrderYearsPriceSet= [];
var OrderYearsSet= [];
class SpendingList extends React.Component {
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
 
       

                var ctx5= document.getElementById('Guest5').getContext('2d');;
                new Chart(ctx5,{
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
     
                <Col>  <canvas id = 'Guest5' ></canvas></Col>
             
      
                </Row>
         
            </div> 
            

        
        )
    }
}

export default SpendingList;