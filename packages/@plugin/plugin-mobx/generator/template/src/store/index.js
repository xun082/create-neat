// store/index.js
import { makeAutoObservable } from "mobx";

function createStore() {
  return makeAutoObservable({
    number: 0,
    isShow: true,
    get double() {
      return this.number * 2;
    },
    changeShow() {
      this.isShow = true;
    },
    changeHide() {
      this.isShow = false;
    },
  });
}

const store = createStore();
export default store;
