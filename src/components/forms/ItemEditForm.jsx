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
var materialAll=[];

axios.defaults.headers.common['Authorization'] = token;
const FormItem = Form.Item;


const ItemEditForm = Form.create()(
    (props) => {
       
        const { visible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title='修改商品信息'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout='vertical'>
                    <FormItem label='商品名称'>
                        {getFieldDecorator('itemName', {
                            rules: [{ required: true, message: '请填写原材料名称' }],
                            initialValue: props.infos.itemName
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='商品图片'>
                        {getFieldDecorator('itemUrl', {
                            rules: [{ required: true, message: '请填写材料图片' }],
                            initialValue: props.infos.itemUrl
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='商品规格'>
                        {getFieldDecorator('itemSpecification', {
                            rules: [{ required: true, message: '请填写材料规格' }],
                            initialValue: props.infos.itemSpecification
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='商品单价'>
                        {getFieldDecorator('itemPrice', {
                            rules: [{ required: true, message: '请填写材料单价' }],
                            initialValue: props.infos.itemPrice
                        })(
                            <InputNumber
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                         
                          />
                        )}
                    </FormItem>
                    <FormItem label='使用材料名称'>
                        {getFieldDecorator('materialId', {
                            rules: [{ required: true, message: '请填写原材料' }],
                            initialValue: props.infos.materialId
                        })(
                            
                            <Select defaultValue={props.infos.materialId} style={{ width: 120 }}  >
                                     
                            {materialAll.map(city=>(
                        
                                <Option key={city.materialId}>{city.materialName}</Option>
                    
                            )
                            )}
                          
                          </Select>

                            
                        )}
                    </FormItem>
                    <FormItem label='商品库存'>
                        {getFieldDecorator('itemNumber', {
                            rules: [{ required: true, message: '请填写商品库存' }],
                            initialValue: props.infos.itemNumber
                        })(
                            <InputNumber min={0} />
                        )}
                    </FormItem>
                    <FormItem label='商品保质期'>
                        {getFieldDecorator('itemDate', {
                            rules: [{ required: true, message: '请填写商品保质期' }],
                            initialValue: moment(props.infos.itemDate)
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

class ItemEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            infos: {
                itemId:'',
                itemUrl: '',
                vendorId: '',
                vendorName: '',
                materialId: '',
                materialName: '',
                itemSpecification: '',
                itemPrice: '',
                itemDate:'',
                itemNumber: '',
                itemName: '',
                modifyiedTime:''
            }
        }
    }
    componentWillMount(){
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
        axios.get(Base.inventoryAPI + '/inventory-material/getAll')
        .then(result => {
            if (result.status === 200 && result.data.code === 200) {
                materialAll=result.data.data
           
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
            json.itemId = this.state.infos.itemId;
            axios.put(Base.inventoryAPI + '/inventory-item/update', json)
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
                <ItemEditForm
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

export default ItemEdit;