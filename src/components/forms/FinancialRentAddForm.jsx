import React from 'react';
import ReactDOM from 'react-dom';

import { Button, Modal, Form, Input, Radio, Select, DatePicker, InputNumber,Space,message  } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;
import moment from 'moment';


var axios = require('axios');
moment.locale('zh-cn');
var Base = require('../../baseConst.js');
var token = window.localStorage.getItem('token');
var vendorAll=[];

axios.defaults.headers.common['Authorization'] = token;
const FormItem = Form.Item;


const FinancialRentAddForm = Form.create()(
    (props) => {
       
        const { addVisible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={ addVisible}
                title='添加电费信息'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
            >
             <Form layout='vertical'>
             <FormItem label='厂商名称'>
                           {getFieldDecorator('vendorId', {
                             rules: [{ required: true, message: '厂商名称' }],
   
                           })(
                               <Select style={{ width: 120 }}  >
                                        
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
                           })(
                            <Input />
                           )}
                       </FormItem>
                       <FormItem label='租约开始时间'>
                           {getFieldDecorator('rentStartTime', {
                               rules: [{ required: true, message: '请填写租约开始时间' }],
                           })(
                               <DatePicker  format="YYYY-MM-DD " />
                           )}
                       </FormItem>
                       <FormItem label='租约结束时间'>
                           {getFieldDecorator('rentEndTime', {
                               rules: [{ required: true, message: '请填写租约结束时间' }],
                           })(
                               <DatePicker  format="YYYY-MM-DD " />
                           )}
                       </FormItem>
   
                       <FormItem label='房东手机号'>
                           {getFieldDecorator('landlordPhone', {
                               rules: [{ required: true, message: '请填写房东手机号' }],
                           })(
                               <Input />
                           )}
                       </FormItem>
                       <FormItem label='房东身份证号'>
                           {getFieldDecorator('landlordidCard', {
                               rules: [{ required: true, message: '请填写房东身份证号' }],
                           })(
                               
                               <Input />
   
                               
                           )}
                       </FormItem>
                       <FormItem label='租约金额'>
                           {getFieldDecorator('rentAmount', {
                               rules: [{ required: true, message: '请填写租约金额' }],
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
                           })(
                               <DatePicker  format="YYYY-MM-DD " />
                           )}
                       </FormItem>
                       <FormItem label='押金'>
                           {getFieldDecorator('theDeposit', {
                               rules: [{ required: true, message: '请填写押金' }],
                           })(
                            <InputNumber
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                         
                          />
                           )}
                       </FormItem>
                       
                       
   
                       <FormItem label='备注'>
                           {getFieldDecorator('remark', {
                           })(
                               <Input />
                           )}
                       </FormItem>
                   </Form>
            </Modal>
        )
    }
);

class FinancialRentAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addVisible: false
 
            }
        }
    componentWillMount(){
        this.selectChange(); 
    }
    componentWillReceiveProps(nextProps) {

        this.setState({
            addVisible: nextProps.showPopAdd,
        });
    }
    showModal() {
        this.setState({
            addVisible: true
        })
    }

    handleCancel() {
        this.setState({
            addVisible: false
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
            axios.post(Base.financialAPI + '/financial-rent/add', json)
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
                <FinancialRentAddForm
                    ref={this.saveFormRef.bind(this)}
                    addVisible={this.state.addVisible}
                    infos={this.state.infos}
                    onCancel={this.handleCancel.bind(this)}
                    onCreate={this.handleCreate.bind(this)}
                  
                />
            </div>
        );
    }onCreate
}

export default FinancialRentAdd;