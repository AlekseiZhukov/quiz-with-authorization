export class UserDataFromSessionStorage {
    static checkUserData () {
        const userData = JSON.parse(sessionStorage.getItem('userData'))
        if (userData) {
            if ( !userData.name || !userData.lastName || !userData.email) {
                location.href = '#/';
            } else {
                console.log(userData)
                return userData

            }
        }
        location.href = '#/';

    }
}