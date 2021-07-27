import React from 'react';
import ReactDOM from 'react-dom';

import { Button, Modal, Form, Input, InputNumber  ,o, Select, DatePicker, TimePicker,Space,message  } from 'antd';

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


const MaterialEditForm = Form.create()(
    (props) => {
       
        const { visible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title='修改材料信息'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout='vertical'>
                    <FormItem label='原材料名称'>
                        {getFieldDecorator('materialName', {
                            rules: [{ required: true, message: '请填写原材料名称' }],
                            initialValue: props.infos.materialName
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='材料图片'>
                        {getFieldDecorator('materialImgUrl', {
                            initialValue: props.infos.materialImgUrl
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='材料规格'>
                        {getFieldDecorator('materialSpecification', {
                            rules: [{ required: true, message: '请填写材料规格' }],
                            initialValue: props.infos.materialSpecification
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='材料单价'>
                        {getFieldDecorator('materialPrice', {
                            rules: [{ required: true, message: '请填写材料单价' }],
                            initialValue: props.infos.materialPrice
                        })(
                            <InputNumber 
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')} 
                             defaultValue={props.infos.materialPrice}/>
                        )}
                    </FormItem>
                    <FormItem label='材料库存'>
                        {getFieldDecorator('materialNumber', {
                            rules: [{ required: true, message: '请填写材料库存' }],
                            initialValue: props.infos.materialNumber
                        })(
                            <InputNumber min={0} />
                        )}
                    </FormItem>
                    <FormItem label='材料保质期'>
                        {getFieldDecorator('expirationDate', {
                            rules: [{ required: true, message: '请填写材料保质期' }],
                            initialValue: moment(props.infos.expirationDate)
                        })(
                            <DatePicker  format="YYYY-MM-DD " />
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
                </Form>
            </Modal>
        )
    }
);

class MaterialEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            infos: {
                materialId:'',
                materialName: '',
                materialImgUrl: '',
                materialSpecification: '',
                materialPrice: '',
                materialNumber: '',
                expirationDate: '',
                vendorName: '',
                vendorId:''
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
            
            json.materialId = this.state.infos.materialId;
            axios.put(Base.inventoryAPI + '/inventory-material/update', json)
                .then(result => {
                    if (result.status === 200 && result.data.code === 200) {
                        this.props.getUser();
                    }
                    if(result.data.type=="error"){
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
                <MaterialEditForm
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

export default MaterialEdit;