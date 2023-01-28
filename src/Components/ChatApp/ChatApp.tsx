import React, { useState, useEffect } from "react";
import { Select, Layout, theme, Button, Modal } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, SmileTwoTone } from "@ant-design/icons";
import type { SelectProps } from 'antd';

import { User, Chat, SignUpUser } from '../../Interfaces/chatInterfaces'
import { initSocket } from "../../Services/socketioService";
import ChatSideBar from './ChatSideBar'
import SignUpForm from '../SignUp'
import "./ChatStyle.scss";

const { Header, Content } = Layout;
const userList: User[] = [
  {_id: 1, name: 'Rahul', email: 'rahul@gmail.com'},
  {_id: 2, name: 'Viney', email: 'vnydev@gmail.com'},
  {_id: 3, name: 'Sandy', email: 'sandy@gmail.com'},
  {_id: 4, name: 'Pankaj', email: 'pankaj@gmail.com'},
  {_id: 5, name: 'Anmol', email: 'anmol@gmail.com'},
  {_id: 6, name: 'Vivek', email: 'vivek@gmail.com'},
]
const options: SelectProps['options'] = userList.map(u => ({
  label: u.name,
  value: u.name
}));

const ChatAppFun: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>();
  const [chatList, setUserChatList] = useState<Chat[]>([]);
  const [selectedUser, setSelectedUser] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [isOnline, setOnlineState] = useState<boolean>(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    (async() => {
      showModal()
      await initSocket(setOnlineState);
    })()
  }, []);

  const handleChange = (value: string[]) => {
    console.log(`selected `, value);
    if (value) {
      setSelectedUser(value)
    }
  }

  const handleClick = () => {
    console.log("onclick value", selectedUser)
    let users: Chat[] = []
    if(selectedUser.length === 1) {
      const chatUser = userList.filter(user => selectedUser.includes(user.name))[0]
      users.push({
        _id: (new Date()).getTime(),
        creatorName: currentUser?.name as string,
        creatorEmail: currentUser?.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [chatUser],
      })
    } else if (selectedUser.length > 1) {
      const chatUsers = userList.filter(user => selectedUser.includes(user.name))
      users.push({
        _id: (new Date()).getTime(),
        groupName: currentUser?.name + ' Group',
        creatorName: currentUser?.name as string,
        creatorEmail: currentUser?.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        members: chatUsers,
      })
    }
    
    setUserChatList(users)
  }

  const handleClear = () => {
    console.log('clear all selection')
    setSelectedUser([])
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (values: SignUpUser) => {
    console.log("sign up info", values)
    setCurrentUser({
      ...values.user,
      _id: (new Date()).getTime()
    })
    setIsModalOpen(false);
  }

  return (
    <Layout>
      {currentUser && <>
        <ChatSideBar
          collapsed={collapsed}
          users={chatList}
          currentUser={currentUser as User}
          isOnline={isOnline}
        ></ChatSideBar>
        <Layout className="site-layout">
          <Header style={{ padding: 0, background: colorBgContainer }}>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}

          <Select
            mode="multiple"
            allowClear
            style={{ width: '80%', marginRight: '10px' }}
            placeholder="Search for user & intiaite chat"
            defaultValue={selectedUser}
            onChange={handleChange}
            onClear={handleClear}
            options={options}
          />
          <Button style={{width:'125px'}} type="primary" size="middle" onClick={handleClick} >Start</Button>
          <SmileTwoTone
            style={{
              fontSize: '25px',
              position: 'relative',
              right: 0,
              left: '1%',
              verticalAlign: 'middle'
            }}
            twoToneColor={ isOnline ? "#52c41a": 'red'}
            />
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            Content
          </Content>
        </Layout>
      </>}

      <Modal
        title="Get Started With SignUP."
        open={isModalOpen}
        // onOk={handleOk}
        // onCancel={handleCancel}
        closable={false}
        focusTriggerAfterClose={false}
        footer={null}
      >
        <SignUpForm onSubmit={handleSubmit} ></SignUpForm>
      </Modal>
    </Layout>
  )
}

export default ChatAppFun