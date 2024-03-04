<script lang="tsx">
import { defineComponent } from "vue";

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

export default defineComponent({
  render() {
    return <div style={containerStyle}>
      <h1 style={{ textAlign: "center", margin: "auto" }}>
        <div>欢迎访问</div>
        <div style={{ marginBottom: "10px" }}>
          <a href="https://juejin.cn/user/3782764966460398/posts">掘金地址</a>
        </div>
        <div>
          <a href="https://github.com/xun082/react-cli">Github地址</a>
        </div>
      </h1>
    </div>
  },
});
</script>
