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
var vendorAll2=[];

axios.defaults.headers.common['Authorization'] = token;
const FormItem = Form.Item;


const FinancialScrapIronAddForm = Form.create()(
    (props) => {
       
        const { addVisible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={ addVisible}
                title='添加铁屑收入信息信息'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
            >
              <Form layout='vertical'>
                <FormItem label='厂商名称'>
                        {getFieldDecorator('vendorId', {
                          rules: [{ required: true, message: '厂商名称' }],

                        })(
                            <Select  style={{ width: 120 }}  >
                                     
                            {vendorAll.map(city=>(
                        
                                <Option key={city.vendorId}>{city.vendorName}</Option>
                    
                            )
                            )}
                          
                          </Select>
                        )}
                    </FormItem>
                    <FormItem label='铁屑卖出时间'>
                        {getFieldDecorator('sellTime', {
                            rules: [{ required: true, message: '请填写铁屑卖出时间' }],
                        })(
                            <DatePicker  format="YYYY-MM-DD " />
                        )}
                    </FormItem>
                    <FormItem label='铁屑每斤金额'>
                        {getFieldDecorator('price', {
                            rules: [{ required: true, message: '铁屑每斤金额' }],
                        })(
                            <InputNumber
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                         
                          />
                        )}
                    </FormItem>

                    <FormItem label='卖出总斤数'>
                        {getFieldDecorator('totalNumber', {
                            rules: [{ required: true, message: '请填写卖出总斤数' }],
                        })(
                            <InputNumber min={0} />
                        )}
                    </FormItem>
                    <FormItem label='总收入'>
                        {getFieldDecorator('totalAmount', {
                            rules: [{ required: true, message: '请填写总收入' }],
                        })(
                            
                            <Input />

                            
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

class FinancialScrapIronAdd extends React.Component {
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
            axios.post(Base.financialAPI + '/financial-scrap-iron/add', json)
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
                <FinancialScrapIronAddForm
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

export default FinancialScrapIronAdd;