import React from 'react';
import ReactDOM from 'react-dom';

import { Button, Modal, Form, Input, InputNumber, Select, DatePicker, TimePicker,Space,message  } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;
import moment from 'moment';

var parenIdArry =[];
var axios = require('axios');
moment.locale('zh-cn');
var Base = require('../../baseConst.js');
var token = window.localStorage.getItem('token');

axios.defaults.headers.common['Authorization'] = token;
const FormItem = Form.Item;


const MenuEditForm = Form.create()(
    (props) => {
       
        const { visible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title='修改菜单信息'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout='vertical'>
                    <FormItem label='菜单名称'>
                        {getFieldDecorator('menuName', {
                            rules: [{ required: true, message: '请填写菜单名称' }],
                            initialValue: props.infos.menuName
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='菜单URL'>
                        {getFieldDecorator('menuUrl', {
                            rules: [{ required: true, message: '请填写菜单URL' }],
                            initialValue: props.infos.menuUrl
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='是否是父级节点'>
                        {getFieldDecorator('isLeaf', {
                            rules: [{ required: true, message: '请填写材料规格' }],
                            initialValue: props.infos.isLeaf
                        })(
                            <Select defaultValue={props.infos.isLeaf} style={{ width: 120 }}  >
                                <Option key={'0'}>是</Option>
                                <Option key={'1'}>否</Option>
                             </Select>
                        )}
                    </FormItem>
                    <FormItem label='排序号'>
                        {getFieldDecorator('sortNo', {
                            rules: [{ required: true, message: '请填写材料规格' }],
                            initialValue: props.infos.sortNo
                        })(
                            <InputNumber min={0} />
                        )}
                    </FormItem>
                 
                    <FormItem label='父级菜单'>
                        {getFieldDecorator('menuParentId', {
                          rules: [{ required: true, message: '父级菜单' }],
                          initialValue: props.infos.menuParentId.toString()

                        })(
                            <Select defaultValue={props.infos.menuParentId} style={{ width: 120 }}  >
                                     
                            {parenIdArry.map(city=>(
                        
                                <Option key={city.menuId}>{city.menuName}</Option>
                    
                            )
                            )}
                          
                          </Select>
                        )}
                    </FormItem>
                    <FormItem label='说明'>
                        {getFieldDecorator('remark', {
                            initialValue: props.infos.remark
                        })(
                            <Input />
                        )}
                    </FormItem>
                
                    <FormItem label='menuKey'>
                        {getFieldDecorator('menuKey', {
                            initialValue: props.infos.menuKey
                        })(
                            <Input />
                        )}
                    </FormItem>
                
                  
                </Form>
            </Modal>
        )
    }
);

class MenuEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            infos: {
                menuId :'',
                isLeaf  :'',
                menuName  :'',
                sortNo  :'',
                menuUrl  :'',
                menuParentId  :'',
                menuParentName :'',
                imageUrl  :'',
                remark  :'',
                isStoped  :'',
                createdUserId  :'',
                modifyiedUserId  :'',     
                menuKey:''
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
        axios.get(Base.userAPI + '/base-menu/getAll',{
            params: {
                isLeaf: '0'

            }
          })
        .then(result => {
            if (result.status === 200 && result.data.code === 200) {
              parenIdArry=result.data.data
               
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
            json.menuId = this.state.infos.menuId;
            axios.put(Base.userAPI + '/base-menu/update', json)
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
                <MenuEditForm
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

export default MenuEdit;