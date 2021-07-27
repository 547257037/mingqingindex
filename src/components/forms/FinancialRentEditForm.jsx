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


const FinancialRentEditForm = Form.create()(
    (props) => {
       
        const { visible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title='修改租房信息'
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
                   
                    <FormItem label='租房地址'>
                        {getFieldDecorator('houseAddress', {
                            rules: [{ required: true, message: '请填写租房地址' }],
                            initialValue: props.infos.houseAddress
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='租约开始时间'>
                        {getFieldDecorator('rentStartTime', {
                            rules: [{ required: true, message: '请填写租约开始时间' }],
                            initialValue: moment(props.infos.rentStartTime)
                        })(
                            <DatePicker  format="YYYY-MM-DD " />
                        )}
                    </FormItem>
                    <FormItem label='租约结束时间'>
                        {getFieldDecorator('rentEndTime', {
                            rules: [{ required: true, message: '请填写租约结束时间' }],
                            initialValue: moment(props.infos.rentEndTime)
                        })(
                            <DatePicker  format="YYYY-MM-DD " />
                        )}
                    </FormItem>

                    <FormItem label='房东手机号'>
                        {getFieldDecorator('landlordPhone', {
                            rules: [{ required: true, message: '请填写房东手机号' }],
                            initialValue: props.infos.landlordPhone
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='房东身份证号'>
                        {getFieldDecorator('landlordidCard', {
                            rules: [{ required: true, message: '请填写房东身份证号' }],
                            initialValue: props.infos.landlordidCard
                        })(
                            
                            <Input />

                            
                        )}
                    </FormItem>
                    <FormItem label='租约金额'>
                        {getFieldDecorator('rentAmount', {
                            rules: [{ required: true, message: '请填写租约金额' }],
                            initialValue: props.infos.rentAmount
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
                            initialValue: moment(props.infos.rentEndTime)
                        })(
                            <DatePicker  format="YYYY-MM-DD " />
                        )}
                    </FormItem>
                    <FormItem label='押金'>
                        {getFieldDecorator('theDeposit', {
                            rules: [{ required: true, message: '请填写押金' }],
                            initialValue: props.infos.theDeposit
                        })(
                            <InputNumber
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                         
                          />
                        )}
                    </FormItem>
                    
                    

                    <FormItem label='备注'>
                        {getFieldDecorator('remark', {
                            initialValue: props.infos.remark
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
);

class FinancialRentEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            infos: {
                rentId :'',
                vendorName :'',
                houseAddress :'',
                
                landlordPhone :'',
                landlordidCard :'',
                rentAmount :'',
                payTime :'',
                theDeposit :'',
                remark :'',
                vendorId :'',
    
    
    
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
            json.rentId = this.state.infos.rentId;
            axios.put(Base.financialAPI + '/financial-rent/update', json)
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
                <FinancialRentEditForm
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

export default FinancialRentEdit;