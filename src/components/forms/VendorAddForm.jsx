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
var vendorAll2=[];

axios.defaults.headers.common['Authorization'] = token;
const FormItem = Form.Item;


const VendorAddForm = Form.create()(
    (props) => {
       
        const { addVisible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={ addVisible}
                title='添加厂商信息'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
            >
               <Form layout='vertical'>
                    <FormItem label='厂商名称'>
                        {getFieldDecorator('vendorName', {
                            rules: [{ required: true, message: '请填写厂商名称'}],

                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='厂商类型'>
                        {getFieldDecorator('vendorType', {
                            rules: [{ required: true, message: '请填写厂商类型'}],

                        })(
                            <Select  style={{ width: 120 }}>
                            <Option value="0">加工厂</Option>
                            <Option value="1">材料厂</Option>
                            <Option value="2">商家</Option>
                            <Option value="3">其他</Option>
                          </Select>
                        )}
                    </FormItem>
                    <FormItem label='厂商电话'>
                        {getFieldDecorator('vendorPhone', {
                            rules: [{ required: true, message: '请填写厂商电话' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='厂商地址'>
                        {getFieldDecorator('vendorAddress', {
                            rules: [{ required: true, message: '请填写厂商地址' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='厂商图片'>
                        {getFieldDecorator('vendorUrl', {
                            rules: [{ required: true, message: '请填写厂商图片' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='法人姓名'>
                        {getFieldDecorator('legalPersonName', {
                            rules: [{ required: true, message: '请填写法人姓名' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='法人电话'>
                        {getFieldDecorator('legalPersonPhone', {
                            rules: [{ required: true, message: '请填写法人电话' }],
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem label='法人身份证'>
                        {getFieldDecorator('legalPersonIdCard', {
                            rules: [{ required: true, message: '请填写法人身份证' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='证书地址'>
                        {getFieldDecorator('certificateAddress', {
                            rules: [{ required: true, message: '请填写证书地址' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
);

class VendorAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addVisible: false
 
            }
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
   


    handleCreate() {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            var json = {};
            json = values;
            axios.post(Base.userAPI + '/inventory-vendor/add', json)
                .then(result => {
                    if (result.status === 200 && result.data.code === 200) {
                        this.props.getUser();
                    }else{
                        message.error( result.data.message)
                    }
                })
                .catch(err => {
                    message.error( result.data.message)
                })
            form.resetFields();
            this.setState({ visible: false,addVisible:false })
        })
    }
    saveFormRef(form) {
        this.form = form;
    }
    render() {
        return (
            <div>
                <VendorAddForm
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

export default VendorAdd;