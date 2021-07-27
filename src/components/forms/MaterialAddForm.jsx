import React from 'react';
import ReactDOM from 'react-dom';

import { Button, Modal, Form, Input, InputNumber, Select, DatePicker, TimePicker,Space,message  } from 'antd';

const { RangePicker } = DatePicker;
import moment from 'moment';

var vendorAll=[];
var axios = require('axios');
moment.locale('zh-cn');
var Base = require('../../baseConst.js');
var token = window.localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = token;
const FormItem = Form.Item;


const MaterialAddForm = Form.create()(
    (props) => {
        const { addVisible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={addVisible}
                title='添加材料信息'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout='vertical'>
                    <FormItem label='原材料名称'>
                        {getFieldDecorator('materialName', {
                            rules: [{ required: true, message: '请填写原材料名称' }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='材料图片'>
                        {getFieldDecorator('materialImgUrl', {
                            rules: [{ required: true, message: '请填写材料图片' }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='材料规格'>
                        {getFieldDecorator('materialSpecification', {
                            rules: [{ required: true, message: '请填写材料规格' }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='材料单价'>
                        {getFieldDecorator('materialPrice', {
                            rules: [{ required: true, message: '请填写材料单价' }],
                        })(
                            <InputNumber 
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')} 
                             />
                        )}
                    </FormItem>
                    <FormItem label='材料库存'>
                        {getFieldDecorator('materialNumber', {
                            rules: [{ required: true, message: '请填写材料库存' }],
                        })(
                            <InputNumber min={0} />
                        )}
                    </FormItem>
                    <FormItem label='材料保质期'>
                        {getFieldDecorator('expirationDate', {
                            rules: [{ required: true, message: '请填写材料保质期' }]
                        })(
                            <DatePicker  format="YYYY-MM-DD " />
                        )}
                    </FormItem>

                    
                    <FormItem label='厂商名称'>
                        {getFieldDecorator('vendorId', {
                            rules: [{ required: true, message: '生产厂商' }],
                        })(
                            <Select  style={{ width: 120 }}  >
                                     
                            {vendorAll.map(city=>(
                        
                                <Option key={city.vendorId}>{city.vendorName}</Option>
                    
                            )
                            )}
                          
                          </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
);

class MaterialAdd extends React.Component {
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
            addVisible: nextProps.showPopAdd
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

    handleCreateAdd() {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            var json = {};
            json = values;
            axios.post(Base.inventoryAPI + '/inventory-material/add', json)
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
            this.setState({ addVisible: false })
        })
    }
    saveFormRef(form) {
        this.form = form;
    }
    render() {
        return (
            <div>
                <MaterialAddForm
                    ref={this.saveFormRef.bind(this)}
                    addVisible={this.state.addVisible}
                    onCancel={this.handleCancel.bind(this)}
                    onCreate={this.handleCreateAdd.bind(this)}
                />
            </div>
        );
    }onCreate
}

export default MaterialAdd;