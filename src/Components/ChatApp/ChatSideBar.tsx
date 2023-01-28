import React, { useEffect, useState } from "react"
import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons"
import { Layout, Menu, theme } from "antd"
import { User, SideBar } from '../../Interfaces/chatInterfaces'
import "./ChatStyle.scss";

const { Sider } = Layout

const ChatSideBar: React.FC<SideBar> = ({
    collapsed,
    users,
    currentUser,
    isOnline,
}: SideBar) => {

    const [userItems, setItems] = useState<any>([])
    useEffect(() => {
        console.log("currentUser", currentUser)
        setItems(users.map(user => ({
            key: user._id,
            icon: <UserOutlined />,
            label: user.creatorName ,
            value: user._id,
        })))
    }, [users])
    return <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="activeUser" style={{
            color: isOnline ? "#52c41a": 'red',
            border: `3px solid ${isOnline ? "#52c41a": 'red'}`
            }} >
            <span>{currentUser?.name?.toUpperCase()}</span>
        </div>
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={userItems}
        />
    </Sider>
}

export default ChatSideBar
