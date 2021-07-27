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
var vendorAll2=[];

axios.defaults.headers.common['Authorization'] = token;
const FormItem = Form.Item;


const ItemAddForm = Form.create()(
    (props) => {
       
        const { addVisible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={ addVisible}
                title='添加商品信息'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
            >
               <Form layout='vertical'>
                    <FormItem label='商品名称'>
                        {getFieldDecorator('itemName', {
                            rules: [{ required: true, message: '请填写原材料名称' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='商品图片'>
                        {getFieldDecorator('itemUrl', {
                            rules: [{ required: true, message: '请填写材料图片' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='商品规格'>
                        {getFieldDecorator('itemSpecification', {
                            rules: [{ required: true, message: '请填写材料规格' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='商品单价'>
                        {getFieldDecorator('itemPrice', {
                            rules: [{ required: true, message: '请填写材料单价' }],
                        })(
                            <InputNumber
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                         
                          />
                        )}
                    </FormItem>
                    <FormItem label='原材料'>
                        {getFieldDecorator('materialId', {
                            rules: [{ required: true, message: '请填写原材料' }],
                        })(
                            <Select style={{ width: 120 }}  >
                                     
                            {vendorAll2.map(city=>(
                        
                                <Option key={city.materialId}>{city.materialName}</Option>
                    
                            )
                            )}
                          
                          </Select>
                        )}
                    </FormItem>
                    <FormItem label='商品库存'>
                        {getFieldDecorator('itemNumber', {
                            rules: [{ required: true, message: '请填写商品库存' }],
                        })(
                            <InputNumber min={0} />
                        )}
                    </FormItem>
                    <FormItem label='商品保质期'>
                        {getFieldDecorator('itemDate', {
                            rules: [{ required: true, message: '请填写商品保质期' }],
                        })(
                            <DatePicker  format="YYYY-MM-DD " />
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
                </Form>
            </Modal>
        )
    }
);

class ItemAdd extends React.Component {
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
   
    selectChange2(){
        axios.get(Base.inventoryAPI + '/inventory-material/getAll')
        .then(result => {
            if (result.status === 200 && result.data.code === 200) {
                vendorAll2=result.data.data
           
            }
            if(result.data.type!=='success'){
                message.error(result.data.message)
            }
        }) 
         .catch(err => {
            console.log(err)
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
            axios.post(Base.inventoryAPI + '/inventory-item/add', json)
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
                <ItemAddForm
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

export default ItemAdd;