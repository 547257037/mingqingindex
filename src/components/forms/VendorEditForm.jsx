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


const VendorEditForm = Form.create()(
    (props) => {
       
        const { visible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title='修改厂商信息'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout='vertical'>
                    <FormItem label='厂商名称'>
                        {getFieldDecorator('vendorName', {
                            rules: [{ required: true, message: '请填写厂商名称'}],
                            initialValue: props.infos.vendorName

                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='厂商类型'>
                        {getFieldDecorator('vendorType', {
                            rules: [{ required: true, message: '请填写厂商类型'}],
                            initialValue: props.infos.vendorType

                        })(
                            <Select  defaultValue={props.infos.vendorType} style={{ width: 120 }}>
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
                            initialValue: props.infos.vendorPhone
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='厂商地址'>
                        {getFieldDecorator('vendorAddress', {
                            rules: [{ required: true, message: '请填写厂商地址' }],
                            initialValue: props.infos.vendorAddress
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='厂商图片'>
                        {getFieldDecorator('vendorUrl', {
                            rules: [{ required: true, message: '请填写厂商图片' }],
                            initialValue: props.infos.vendorUrl
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='法人姓名'>
                        {getFieldDecorator('legalPersonName', {
                            rules: [{ required: true, message: '请填写法人姓名' }],
                            initialValue: props.infos.legalPersonName
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='法人电话'>
                        {getFieldDecorator('legalPersonPhone', {
                            rules: [{ required: true, message: '请填写法人电话' }],
                            initialValue: props.infos.legalPersonPhone
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem label='法人身份证'>
                        {getFieldDecorator('legalPersonIdCard', {
                            rules: [{ required: true, message: '请填写法人身份证' }],
                            initialValue: props.infos.legalPersonIdCard
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='证书地址'>
                        {getFieldDecorator('certificateAddress', {
                            rules: [{ required: true, message: '请填写证书地址' }],
                            initialValue: props.infos.certificateAddress
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
);

class VendorEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            infos: {
                vendorId:'',
                vendorUrl: '',
                vendorName: '',
                vendorType: '',
                vendorPhone: '',
                vendorAddress: '',
                legalPersonName: '',
                legalPersonPhone: '',
                legalPersonIdCard:'',
                certificateAddress: '',
                createdUserId: '',
                createdTime:'',
                modifyiedUserId:'',
                modifyiedTime:'',
                isDeleted:''
            }
        }
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

    handleCreate() {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            var json = {};
            json = values;
            json.vendorType=parseInt(json.vendorType)
            json.vendorId = this.state.infos.vendorId;
            axios.put(Base.userAPI + '/inventory-vendor/update', json)
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
                <VendorEditForm
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

export default VendorEdit;