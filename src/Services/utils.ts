const setInLocalStorage = (user: any): void => {
    const getUsers = window.localStorage.getItem('users')
    let usersList = []
    if (getUsers === null || !getUsers) {
        usersList.push(user)
    } else {
        usersList = [...(JSON.parse(getUsers)), user]
    }

    window.localStorage.setItem('users', JSON.stringify(usersList))
}

const getDataByKey = (key: string): string => {
   return window.localStorage.getItem(key) as string
}

const isUserExistLCS = (email: string, phone: string) => {
    let getUsers: null | string | Array<any> = window.localStorage.getItem('users')
    if (getUsers === null || !getUsers) {
        return {
            isNewUser: false,
            allUsers: []
        }
    } else {
        getUsers = JSON.parse(getUsers) as Array<any>
        const allUsers = getUsers.filter(i => i.email === email || i.phone === phone)
        return {
            isNewUser: allUsers.length > 0 ? true : false,
            allUsers,
        }
    }
}

export {
    setInLocalStorage,
    getDataByKey,
    isUserExistLCS,
}