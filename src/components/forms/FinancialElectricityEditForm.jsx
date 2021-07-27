import React from 'react';
import ReactDOM from 'react-dom';

import {  Modal, Form, Input, Select, DatePicker, message,InputNumber   } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;
import moment from 'moment';


var axios = require('axios');
moment.locale('zh-cn');
var Base = require('../../baseConst.js');
var token = window.localStorage.getItem('token');
var vendorAll=[];
var userAll=[];

axios.defaults.headers.common['Authorization'] = token;
const FormItem = Form.Item;


const FinancialElectricityEditForm = Form.create()(
    (props) => {
       
        const { visible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title='修改电费信息'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout='vertical'>
                <FormItem label='厂商名称'>
                        {getFieldDecorator('vendorId', {
                          rules: [{ required: true, message: '厂商名称' }],
                          initialValue: props.infos.vendorId

                        })(
                            <Select defaultValue={props.infos.vendorId} style={{ width: 120 }}  >
                                     
                            {vendorAll.map(city=>(
                        
                                <Option key={city.vendorId}>{city.vendorName}</Option>
                    
                            )
                            )}
                          
                          </Select>
                        )}
                    </FormItem>

                    <FormItem label='缴费开始时间'>
                        {getFieldDecorator('startTime', {
                            rules: [{ required: true, message: '请填写缴费开始时间' }],
                            initialValue: moment(props.infos.startTime)
                        })(
                            <DatePicker  format="YYYY-MM-DD " />
                        )}
                    </FormItem>
                    <FormItem label='缴费结束时间'>
                        {getFieldDecorator('endTime', {
                            rules: [{ required: true, message: '请填写缴费结束时间' }],
                            initialValue: moment(props.infos.endTime)
                        })(
                            <DatePicker  format="YYYY-MM-DD " />
                        )}
                    </FormItem>
    
                    <FormItem label='电费每度金额'>
                        {getFieldDecorator('price', {
                            rules: [{ required: true, message: '电费每度金额' }],
                            initialValue: props.infos.price
                        })(
                            <InputNumber
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                         
                          />
                        )}
                    </FormItem>

                    <FormItem label='使用度数'>
                        {getFieldDecorator('useTotalAmount', {
                            rules: [{ required: true, message: '请填写使用度数' }],
                            initialValue: props.infos.useTotalAmount
                        })(
                            <InputNumber min={0} />
                        )}
                    </FormItem>
                    <FormItem label='缴费总额'>
                        {getFieldDecorator('payTotalAmount', {
                            rules: [{ required: true, message: '请填写缴费总额' }],
                            initialValue: props.infos.payTotalAmount
                        })(
                            
                            <InputNumber
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                         
                          />

                            
                        )}
                    </FormItem>
           
                    <FormItem label='缴费日期'>
                        {getFieldDecorator('payTime', {
                            rules: [{ required: true, message: '请填写缴费日期' }],
                            initialValue: moment(props.infos.payTime)
                        })(
                            <DatePicker  format="YYYY-MM-DD " />
                        )}
                    </FormItem>
                    
    
                  

                    <FormItem label='备注'>
                        {getFieldDecorator('remark', {
                            initialValue: props.infos.remark
                        })(
                            <Input rows={3} />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
);

class FinancialElectricityEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            infos: {
                startTime : '',
                vendorName : '',
                electricityId : '',
                endTime : '',
                price : '',
                useTotalAmount : '',
                payTotalAmount : '',
                payTime : '',
                vendorId : '',
                remark : '',
      
                isDeleted : '',
        
                createdUserId : '',
                modifyiedUserId : '',     
                modifyiedTime : '',
                createdTime : '',
            }
        }
    }
    componentWillMount(){
        this.selectChange(); 
    }
    componentWillReceiveProps(nextProps) {
        if (!nextProps.infos) {
            return;
        }
       
        this.setState({
            visible: nextProps.showPop,
            infos: nextProps.infos
        });
    }
    showModal() {
        this.setState({
            visible: true
        })
    }

    handleCancel() {
        this.setState({
            visible: false
        })
    }
    selectChange(){
        axios.get(Base.userAPI + '/inventory-vendor/getAll')
        .then(result => {
            if (result.status === 200 && result.data.code === 200) {
                vendorAll=result.data.data
           
            }
            if(result.data.type!=='success'){
                message.error(result.data.message)
            }
        }) 
         .catch(err => {
            console.log(err)
        })
    }

    handleCreate() {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            var json = {};
            json = values;
            json.electricityId = this.state.infos.electricityId;
            axios.put(Base.financialAPI + '/financial-electricity/update', json)
                .then(result => {
                    if (result.status === 200 && result.data.code === 200) {
                        this.props.getUser();
                    }
                    if(result.data.type!=='success'){
                        message.error(result.data.message)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            form.resetFields();
            this.setState({ visible: false })
        })
    }
    saveFormRef(form) {
        this.form = form;
    }
    render() {
        return (
            <div>
                <FinancialElectricityEditForm
                    ref={this.saveFormRef.bind(this)}
                    visible={this.state.visible}
                    infos={this.state.infos}
                    onCancel={this.handleCancel.bind(this)}
                    onCreate={this.handleCreate.bind(this)}
                  
                />
            </div>
        );
    }onCreate
}

export default FinancialElectricityEdit;