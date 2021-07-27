import React from 'react';
import ReactDOM from 'react-dom';

import { Button, Modal, Form, Input, InputNumber, Select, DatePicker, TimePicker,Space,message  } from 'antd';

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


const FinancialWageAddForm = Form.create()(
    (props) => {
       
        const { addVisible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={ addVisible}
                title='添加工资信息'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
            >
             <Form layout='vertical'>
                    <FormItem label='员工姓名'>
                        {getFieldDecorator('userId', {
                            rules: [{ required: true, message: '请填写姓名' }],
                        })(
                              <Select  style={{ width: 120 }}  >
                                     
                            {userAll.map(city=>(
                        
                                <Option key={city.userId}>{city.userName}</Option>
                    
                            )
                            )}
                          
                          </Select>
                        )}
                    </FormItem>

                    <FormItem label='工资类型'>
                        {getFieldDecorator('wageType', {
                            rules: [{ required: true, message: '请填工资类型' }],
                        })(
                            <Select  style={{ width: 120 }}  >
                                <Option key={'0'}>计件</Option>
                                <Option key={'1'}>底薪</Option>
                                <Option key={'2'}>其他</Option>
                          </Select>
                        )}
                    </FormItem>
         
                               <FormItem label='基本工资'>
                        {getFieldDecorator('basicWage', {
                            rules: [{ required: true, message: '请填基本工资' }],
                        })(
                            <InputNumber
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                         
                          />
                        )}
                    </FormItem>

                    <FormItem label='报废产品扣费'>
                        {getFieldDecorator('scrapItemFee', {
                            rules: [{ required: true, message: '请填写材料单价' }],
                            
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='矿工天数'>
                        {getFieldDecorator('minersNumber', {
                            rules: [{ required: true, message: '请填写原材料' }],
                            
                        })(
                            
                            <InputNumber min={0} />

                            
                        )}
                    </FormItem>
                    <FormItem label='出勤天数'>
                        {getFieldDecorator('attendanceNumber', {
                            rules: [{ required: true, message: '请填写商品库存' }],
                           
                        })(
                            <InputNumber min={0} />
                        )}
                    </FormItem>
                    <FormItem label='工资开始时间'>
                        {getFieldDecorator('wageStartTime', {
                            rules: [{ required: true, message: '请填写工资开始时间' }],
                           
                        })(
                            <DatePicker  format="YYYY-MM-DD " />
                        )}
                    </FormItem>
                    <FormItem label='工资结束时间'>
                        {getFieldDecorator('wageEndTime', {
                            rules: [{ required: true, message: '请填写工资结束时间' }],
                            
                        })(
                            <DatePicker  format="YYYY-MM-DD " />
                        )}
                    </FormItem>

                    <FormItem label='应发工资'>
                        {getFieldDecorator('shouldWage', {
                            rules: [{ required: true, message: '请填写应发工资' }],
                           
                        })(
                            <InputNumber
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                         
                          />
                        )}
                    </FormItem>
                    <FormItem label='实发工资'>
                        {getFieldDecorator('actualWage', {
                            rules: [{ required: true, message: '请填写实发工资' }],
                           
                        })(
                            <InputNumber
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                         
                          />
                        )}
                    </FormItem>
                    
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

class FinancialWageAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addVisible: false
 
            }
        }
    componentWillMount(){
        this.selectChange(); 
        this.selectChange2(); 
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
    selectChange2(){
        axios.get(Base.userAPI + '/base-user/getAll')
        .then(result => {
            if (result.status === 200 && result.data.code === 200) {
                userAll=result.data.data
           
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
            axios.post(Base.financialAPI + '/financial-wage/add', json)
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
                <FinancialWageAddForm
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

export default FinancialWageAdd;