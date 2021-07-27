import React from 'react';

import {  Modal, Form, Input, Radio, Select, DatePicker, TimePicker, Space, message } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;
import moment from 'moment';


var axios = require('axios');
moment.locale('zh-cn');
var Base = require('../../baseConst.js');
var token = window.localStorage.getItem('token');
var vendorAll = [];
var roleAll = [];

axios.defaults.headers.common['Authorization'] = token;
const FormItem = Form.Item;


const UserEditForm = Form.create()(
    (props) => {

        const { visible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title='修改用户信息'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout='vertical'>
                    <FormItem label='用户名称'>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: '请填写用户名称' }],
                            initialValue: props.infos.userName

                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='用户性别'>
                        {getFieldDecorator('sex', {
                            initialValue: props.infos.sex
                        })(
                            <Select defaultValue={props.infos.sex} style={{ width: 120 }}>
                                <Option value="0">男</Option>
                                <Option value="1">女</Option>
                                <Option value="2">保密</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label='证件号码'>
                        {getFieldDecorator('idNumber', {
                            rules: [{ required: true, message: '请填写证件号码' }],
                            initialValue: props.infos.idNumber
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='证件类型代码'>
                        {getFieldDecorator('idTypeCode', {
                            rules: [{ required: true, message: '请填写证件类型代码' }],
                            initialValue: props.infos.idTypeCode
                        })(
                            <Select defaultValue={props.infos.idTypeCode} style={{ width: 120 }}>
                            <Option value="0">身份证</Option>
                            <Option value="1">护照</Option>
                            <Option value="2">户口本</Option>
                            <Option value="3">其他</Option>
                        </Select>
                        )}
                    </FormItem>


                    
                    <FormItem label='选择角色'>
                        {getFieldDecorator('roleId', {
                          rules: [{ required: true, message: '选择角色' }],
                                       
                          initialValue: props.infos.roleId.toString()
                        })(
                            <Select defaultValue={props.infos.roleId} style={{ width: 120 }}  >
                                     
                            {
                            
                            roleAll.map(city=>(
                        
                                <Option key={city.roleId}>{city.roleName}</Option>
                    
                            )
                            )}
                          
                          </Select>
                        )}
                    </FormItem>
                    <FormItem label='厂商名称'>
                        {getFieldDecorator('vendorId', {
                          rules: [{ required: true, message: '生产厂商' }],
                                       
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
                    <FormItem label='出生日期'>
                        {getFieldDecorator('dateOfBirth', {
                            initialValue: moment(props.infos.dateOfBirth)
                        })(
                            <DatePicker format="YYYY-MM-DD " />
                        )}
                    </FormItem>
                    <FormItem label='联系电话'>
                        {getFieldDecorator('telephone', {
                            rules: [{ required: true, message: '请填联系电话' }],
                            initialValue: props.infos.telephone
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='手机短号'>
                        {getFieldDecorator('shortMobile', {
                            initialValue: props.infos.shortMobile
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='登录用户名'>
                        {getFieldDecorator('accountNo', {
                            rules: [{ required: true, message: '请填写登录用户名' }],
                            initialValue: props.infos.accountNo
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='登录密码' >
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请填写登录密码' }],
                            initialValue: props.infos.password
                        })(
                            <Input type='password'/>

                        )}
                    </FormItem>

                </Form>
            </Modal>
        )
    }
);

class UserEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            infos: {
                userId: "",
                vendorId: "",
                vendorName: "",
                userName: "",
                jobNo: "",
                accountNo: "",
                password: "",
                sex: '',
                idTypeCode: "",
                idNumber: "",
                shortMobile: "",
                telephone: "",
                dateOfBirth: "",
                professionalName: "",
                isDeleted: "",
                roleId: "",
                functions: "",
                createdUserId: "",
                modifyiedUserId: "",
                modifyiedTime: "",
                createdTime: ""
            }
        }
    }
    componentWillMount() {
        this.selectChange();
        this.selectChange2();
        
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
    selectChange() {
        axios.get(Base.userAPI + '/inventory-vendor/getAll')
            .then(result => {
                if (result.status === 200 && result.data.code === 200) {
                    vendorAll = result.data.data

                }
                if(result.data.type!=='success'){
                    message.error(result.data.message)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    selectChange2() {
        axios.get(Base.userAPI + '/base-role/getAll')
            .then(result => {
                if (result.status === 200 && result.data.code === 200) {
                    roleAll = result.data.data

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
            json.userId = this.state.infos.userId;
            axios.put(Base.userAPI + '/base-user/update', json)
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
                <UserEditForm
                    ref={this.saveFormRef.bind(this)}
                    visible={this.state.visible}
                    infos={this.state.infos}
                    onCancel={this.handleCancel.bind(this)}
                    onCreate={this.handleCreate.bind(this)}
                />
            </div>
        );
    } onCreate
}

export default UserEdit;