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
class SpendingTotal extends React.Component {
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
         

                var ctx3= document.getElementById('Guest3').getContext('2d');;
                new Chart(ctx3,{
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
     
                <Col>  <canvas id = 'Guest3' ></canvas></Col>
             
      
                </Row>
       
            </div> 
            

        
        )
    }
}

export default SpendingTotal;