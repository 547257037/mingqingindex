import React from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js'

class MyChart extends React.Component {
    constructor(props){
        
        super(props);
    }
    initChart () {
        const { data, type, options, id } = this.props;
        
        var ctx = document.getElementById(id);
        new Chart(ctx,{
            type,
            data,
            options
        })
        console.log(66,this.props);
    }

    componentDidUpdate () {
        this.initChart();
    }
    render () {
        return (
            <div style = {{width:'300px' ,height:'300px'}} >
                <canvas id = {this.props.id}  width="200" height="200"></canvas>
            </div> 
        )
    }
}

export default MyChart;
