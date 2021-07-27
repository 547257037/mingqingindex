import React from 'react';
import ReactDOM from 'react-dom';

import { Button, Modal, Form, Input, Radio, Select, DatePicker, TimePicker,Space,message  } from 'antd';

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


const UserAddForm = Form.create()(
    (props) => {
       
        const { addVisible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={ addVisible}
                title='添加用户'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
            >
               <Form layout='vertical'>
               <FormItem label='用户名称'>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: '请填写用户名称' }],

                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='用户性别'>
                        {getFieldDecorator('sex', {

                        })(
                            <Select  style={{ width: 120 }}>
                                <Option value="0">男</Option>
                                <Option value="1">女</Option>
                                <Option value="2">保密</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label='证件号码'>
                        {getFieldDecorator('idNumber', {
                            rules: [{ required: true, message: '请填写证件号码' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='证件类型代码'>
                        {getFieldDecorator('idTypeCode', {
                            rules: [{ required: true, message: '请填写证件类型代码' }],
                        })(
                            <Select  style={{ width: 120 }}>
                            <Option value="0">身份证</Option>
                            <Option value="1">护照</Option>
                            <Option value="2">户口本</Option>
                            <Option value="3">其他</Option>
                        </Select>
                        )}
                    </FormItem>
                    <FormItem label='厂商名称'>
                        {getFieldDecorator('vendorId', {
                          rules: [{ required: true, message: '生产厂商' }],
                        })(
                            <Select style={{ width: 120 }}  >
                                     
                            {vendorAll.map(city=>(
                        
                                <Option key={city.vendorId}>{city.vendorName}</Option>
                    
                            )
                            )}
                          
                          </Select>
                        )}
                    </FormItem>
                    <FormItem label='出生日期'>
                        {getFieldDecorator('dateOfBirth', {
                        })(
                            <DatePicker format="YYYY-MM-DD " />
                        )}
                    </FormItem>
                    <FormItem label='联系电话'>
                        {getFieldDecorator('telephone', {
                            rules: [{ required: true, message: '请填联系电话' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='手机短号'>
                        {getFieldDecorator('shortMobile', {
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='登录用户名'>
                        {getFieldDecorator('accountNo', {
                            rules: [{ required: true, message: '请填写登录用户名' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='登录密码' >
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请填写登录密码' }],
                        })(
                            <Input type='password'/>

                        )}
                    </FormItem>

                </Form>
            </Modal>
        )
    }
);

class UserAdd extends React.Component {
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
            axios.post(Base.userAPI + '/base-user/add', json)
                .then(result => {
                    if (result.status === 200 && result.data.code === 200) {
                        this.props.getUser();
                    }
                    if(result.data.type!=='success'){
                        message.error(result.data.message)
                    }
                })
                .catch(err => {
                    message.error(result.data.message)
                    this.setState({ visible: false })
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
                <UserAddForm
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

export default UserAdd;