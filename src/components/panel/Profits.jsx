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
class Profits extends React.Component {
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
          
                var ctx4= document.getElementById('Guest4').getContext('2d');;
                new Chart(ctx4,{
                    type: 'bar',
                    data: {
                        labels: result.data.data.OrderYearsSet,
                        datasets: [{
                            label: '总利润:'+result.data.data.ProfitsAll,
                            data: result.data.data.profitsList,
                            backgroundColor: 
                                'rgba(232,0,0)',
                           
                            borderColor:  'rgba(232,0,0)',
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
               <Col>  <canvas id = 'Guest4'></canvas></Col>
         
                </Row>

            </div> 
            

        
        )
    }
}

export default Profits;