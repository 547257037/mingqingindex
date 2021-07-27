import React from 'react';
import ReactDOM from 'react-dom';

import {  Modal, Form, Input, Select, DatePicker, message,InputNumber  } from 'antd';

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


const FinancialLiabilitiesEditForm = Form.create()(
    (props) => {
       
        const { visible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title='修改债务信息'
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
                    <FormItem label='借款金额'>
                        {getFieldDecorator('borrowingAmount', {
                            rules: [{ required: true, message: '请填写使用度数' }],
                            initialValue: props.infos.borrowingAmount
                        })(
                            <InputNumber
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                         
                          />
                        )}
                    </FormItem>

                    
                    <FormItem label='借款联系人电话'>
                        {getFieldDecorator('sourcePhone', {
                            rules: [{ required: true, message: '请填写使用度数' }],
                            initialValue: props.infos.sourcePhone
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='借款时间'>
                        {getFieldDecorator('borrowingTime', {
                            rules: [{ required: true, message: '请填写借款时间' }],
                            initialValue: moment(props.infos.borrowingTime)
                        })(
                            <DatePicker  format="YYYY-MM-DD " />
                        )}
                    </FormItem>
                    <FormItem label='约定归还时间'>
                        {getFieldDecorator('returnTime', {
                            rules: [{ required: true, message: '请填写归还时间' }],
                            initialValue: moment(props.infos.returnTime)
                        })(
                            <DatePicker  format="YYYY-MM-DD " />
                        )}
                    </FormItem>
    
                    <FormItem label='月利息（单位%）'>
                        {getFieldDecorator('monthInterest', {
                            rules: [{ required: true, message: '月利息' }],
                            initialValue: props.infos.monthInterest
                        })(
                            <InputNumber 
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')} />
                        )}
                    </FormItem>

                
                    <FormItem label='借款状态'>
                        {getFieldDecorator('liabilitiesState', {
                            rules: [{ required: true, message: '请填写缴费总额' }],
                            initialValue: props.infos.liabilitiesState.toString()
                        })(
                            
                            <Select defaultValue={props.infos.liabilitiesState} style={{ width: 120 }}  >
                                     
                                <Option key={'0'}>未结清</Option>
                                <Option key={'1'}>已结清</Option>
                                <Option key={'2'}>销毁</Option>
                
                          </Select>

                            
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

class FinancialLiabilitiesEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            infos: {
                liabilitiesId :'',
                liabilitiesSource :'',
                houseAddress :'',
                
                borrowingTime :'',
                returnTime :'',
                monthInterest :'',
                liabilitiesState :'',
                liabilitiesStateName :'',
                vendorId :'',
                vendorName :'',
                sourcePhone :'',
                borrowingAmount:'',
                remark:'',
    
                rentStartTime :'',
                rentEndTime :'',
                createdUserId :'',
                modifyiedUserId :'',       
                modifyiedTime :'',
                createdTime :'',
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
            json.liabilitiesId = this.state.infos.liabilitiesId;
            axios.put(Base.financialAPI + '/financial-liabilities/update', json)
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
                <FinancialLiabilitiesEditForm
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

export default FinancialLiabilitiesEdit;