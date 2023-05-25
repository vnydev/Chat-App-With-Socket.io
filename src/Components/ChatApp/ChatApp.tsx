import React, { useState, useEffect } from "react";
import { Select, Layout, theme, Button, Modal } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, SmileTwoTone } from "@ant-design/icons";
import type { SelectProps } from 'antd';

import { setInLocalStorage, isUserExistLCS, getDataByKey } from '../../Services/utils'
import { User, Chat, SignUpUser } from '../../Interfaces/chatInterfaces'
import { initSocket, getSocketInstance } from "../../Services/socketioService";
import ChatSideBar from './ChatSideBar'
import SignUpForm from '../SignUp'
import "./ChatStyle.scss";

const { Header, Content } = Layout;
// const userList: User[] = [
//   {_id: 1, name: 'Rahul', email: 'rahul@gmail.com'},
//   {_id: 2, name: 'Viney', email: 'vnydev@gmail.com'},
//   {_id: 3, name: 'Sandy', email: 'sandy@gmail.com'},
//   {_id: 4, name: 'Pankaj', email: 'pankaj@gmail.com'},
//   {_id: 5, name: 'Anmol', email: 'anmol@gmail.com'},
//   {_id: 6, name: 'Vivek', email: 'vivek@gmail.com'},
// ]


const ChatAppFun: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>();
  const [chatList, setUserChatList] = useState<Chat[]>([]);
  const [selectedUser, setSelectedUser] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [isOnline, setOnlineState] = useState<boolean>(false);
  const [options, setOptions] = useState<SelectProps['options']>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  let socket: any

  useEffect(() => {
    (async() => {
      setIsModalOpen(true);
      socket = await initSocket(setOnlineState);      
    })()
  }, []);

  const handleChange = (value: string[]) => {
    console.log("handleChange switch chat", value)
    if (value) {
      setSelectedUser(value)
    }
  }

  const handleClick = () => {
    console.log('handleClick', selectedUser)
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
    console.log("set chatlist", users)
    setUserChatList(users)
  }

  const handleClear = () => {
    setSelectedUser([])
  }

  const handleSubmit = async (values: SignUpUser) => {
    const newUser = {
      ...values.user,
      _id: (new Date()).getTime()
    }

    if (!socket) {
      socket = await getSocketInstance()
    }

    const {isNewUser, allUsers} = isUserExistLCS(newUser.email, newUser.phone as string)
    ioListenner(!isNewUser ? newUser : allUsers[0])

    if (!isNewUser) {
      setCurrentUser(newUser)
      setInLocalStorage(newUser)
      setIsModalOpen(false);
      socket.emit('WatchNewUser','New User Added')
    } else {
      setCurrentUser(allUsers[0])
      setIsModalOpen(false);
      alert('User already exist please try with new email and phone.')
      socket.emit('WatchNewUser','New User Added')
    }
  }

  const ioListenner = async (activeUser: User) => {
    if(!socket) {
      socket = await getSocketInstance()
    }
    socket.on('FetchUsers', () => {
      prepareUserOptions(activeUser)
    })
  }

  const prepareUserOptions = (activeUser: User) => {
    const getAllusers = JSON.parse(getDataByKey('users'))
    const allUsers = getAllusers.filter((u: User) => u.email != activeUser?.email)
    const userOptions = allUsers.map((u: User) => ({
      label: u.name,
      value: u.name
    }));
    setUserList(allUsers)
    setOptions(userOptions)
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