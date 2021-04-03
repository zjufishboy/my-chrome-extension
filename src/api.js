const fetchOrigin = window.fetch;
let blockInfoStr = localStorage.getItem("blockInfo");
let blockInfo = {};
if (!blockInfoStr) {
  blockInfo = {
    block_username_list: [],
    block_aonymous: false,
  };
  localStorage.setItem("blockInfo", JSON.stringify(blockInfo));
} else {
  blockInfo = JSON.parse(blockInfoStr);
}

window.fetch = (url, conf) => {
  const origin = url.split("?")[0];
  //   console.log(origin);
  if (origin !== "https://api.cc98.org/topic/new") {
    return fetchOrigin(url, conf);
  } else {
    return fetchOrigin(url, conf)
      .then((res) => res.json())
      .then((res) => {
        const filteredRes = res.filter((item) => {
          // 黑名单里有
          if (blockInfo.block_username_list.includes(item.userName)) {
            return false;
          }
          // 禁止匿名
          if (blockInfo.block_aonymous && item.userName === null) {
            return false;
          }
          return true;
        });
        return {
          json: () => filteredRes,
        };
      });
  }
};

window.clearBlockList = () => {
  blockInfo = {
    block_username_list: [],
    block_aonymous: false,
  };
  localStorage.setItem("blockInfo", JSON.stringify(blockInfo));
  window.location.reload();
};

window.showBlockList = () => {
  return blockInfo.block_username_list;
};
