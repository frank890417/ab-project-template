<template lang="pug">
.page
  h5.mt-4.mb-4.text-center Img Previewer
  //- input(type="number"  v-model="columeSize")

  .container-fluid
    .row
      .col-sm-1.fixed(v-if="showSidebar")
        label Show Checkbox
        input.form-control(type="checkbox", v-model="showFeature")
        input.form-control(v-model="keyword", placeholder="hash... etc")
        ul.featureList
          li(v-for="s in summary", @click="keyword = s[0]") 
            span {{ s[0] }}:
            span(style="opacity: 0.6") &nbsp;{{ s[1] }}
        a.text-right.float-right.d-inline-block(
          href="https://boring-blackwell-c7116e.netlify.app/index_randomhash.html",
          target="_blank"
        ) Random Hash Checker Tool

      .col-sm-1(v-if="showSidebar")
      div(:class="{ 'col-sm-11': showSidebar, 'col-sm-12': !showSidebar }")
        h5.text-right Item Count: {{ filteredList.length }}

        .row
          .item(v-for="item in filteredList", :class="`col-sm-${columeSize}`")
            a(:href="getLink(item)", target="_blank")
              img.w-100(:src="getImg(item)", :key="item.hash")
              //- iframe.w-100(:src="getLink(item)")
              pre.py-3(v-if="showPre") {{ item.hash }}
            ul.featureList(v-if="showFeature")
              li.text-left(v-for="attr in convertList(item)") 
                span {{ attr[0] }}
                span :
                span {{ attr[1] }}
</template>cd

<script>
//scp -r ../img mono:/var/www/html/wc_previews
// import features from "../public/img/features.json";

export default {
  created() {
    this.fetchNewData();
    setInterval(() => {
      this.fetchNewData();
    }, 5000);
  },
  name: "App",
  data() {
    return {
      features: [],
      keyword: "",
      columeSize: 3,
      showPre: false,
      showSidebar: true,
      showFeature: false,
    };
  },
  methods: {
    fetchNewData() {
      fetch("/img/features.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((json) => {
          this.features = json.reverse();
          //console.log(this.users);
        })
        .catch(function () {
          throw "no feature json file";
        });
    },
    convertList(feature) {
      return Object.entries(feature.features || {}).filter((t) => t[1] !== "");
    },
    getLink(item) {
      // return `https://boring-blackwell-c7116e.netlify.app/index_tokanhashtool.html?`;
      // return `https://monoame.com/wc_previews/${item.hash}.png`;
      return `http://localhost:5501/public/index.html?hash=${item.hash}`;
    },
    getImg(item) {
      // return `https://boring-blackwell-c7116e.netlify.app/index_tokanhashtool.html?`;
      return `/img/${item.hash}.png`;
      // return `https://boring-blackwell-c7116e.netlify.app/index_tokenhashtool.html?hash=${item.hash}`;
    },
  },
  computed: {
    filteredList() {
      if (this.keyword) {
        return this.features.filter(
          (item) =>
            (
              item.hash +
              "  " +
              this.convertList(item)
                .map((t) => t.join(": "))
                .join("\n")
            )
              .toLowerCase()
              .indexOf(this.keyword.toLowerCase()) != -1
        );
      }
      return this.features;
    },
    summary() {
      let allData = this.features.map((obj) => obj.features).flat();
      let summary = {};
      allData.forEach((item) => {
        Object.entries(item || {}).forEach((pair) => {
          let attr = pair[0] + ": " + pair[1];
          if (typeof summary[attr] == "undefined") {
            summary[attr] = 0;
          }
          summary[attr]++;
        });
      });
      let report = Object.entries(summary).sort((a, b) =>
        a[0] > b[0] ? 1 : -1
      );
      return report;
    },
  },
};
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";
.fixed {
  position: fixed;
}
html,
body {
  background-color: black;
  color: white;
  margin: 0;
  padding: 0;
}
pre {
  color: white;
}
#app {
  word-break: break-all;
}
.item {
  color: white;
  border: solid 1px rgba(white, 0.2);
  img {
    width: 100%;
  }
  padding: 0;
}
a {
  color: white;
}
.featureList {
  height: 38vh;
  overflow-y: auto;
  li {
    cursor: pointer;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}
.featureList {
  font-size: 13px;
}
</style>
