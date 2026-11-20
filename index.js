(() => {
  const { metro, patcher } = vendetta;
  const TARGET_ID = "1184885354751344690";
  let patches = [];

  return {
    onLoad() {
      const PrivateChannelSortStore = metro.findByStoreName("PrivateChannelSortStore");
      const ChannelStore = metro.findByStoreName("ChannelStore");

      if (PrivateChannelSortStore?.getPrivateChannelIds) {
        patches.push(
          patcher.after("getPrivateChannelIds", PrivateChannelSortStore, (_, res) => {
            return Array.isArray(res) ? res.filter((id) => id !== TARGET_ID) : res;
          })
        );
      }

      if (ChannelStore?.getSortedPrivateChannels) {
        patches.push(
          patcher.after("getSortedPrivateChannels", ChannelStore, (_, res) => {
            return Array.isArray(res) ? res.filter((ch) => ch?.id !== TARGET_ID) : res;
          })
        );
      }
    },
    onUnload() {
      patches.forEach((unpatch) => unpatch());
      patches = [];
    }
  };
})();
