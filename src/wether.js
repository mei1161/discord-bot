import axiosBase from 'axios';

class wether {
  constructor(ApiKey) {
      this.axios = axiosBase.create({
          baseURL: 'http://api.openweathermap.org/data/2.5',
          headers: {
          }
      });
      this.ApiKey = ApiKey;
  }

  async getWether(location, units) {
    try {
        let result = await this.axios.get(`/weather?q=${location}&units=${units}&appid=${this.ApiKey}`);
        return result.data;
    } catch (e) {
        console.log(e)
        throw (e.response.data.detail);
    }
  }

}

async function main(){
  let result = await axiosBase.get(`http://google.com/`);
  console.log(result)
}
main();
module.exports = wether