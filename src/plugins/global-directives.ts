import Vue from "vue";

import { Attachment } from "@/model/attachment";

Vue.directive("set-attach-size", function (el, binding) {
  const attachment: Attachment = binding.value.attach;
  const img = new Image();
  const maxSize = binding.value.maxSize;

  img.onload = () => {
    let height = attachment.height || 0;
    let width = attachment.width || 0;

    if (!attachment.width && !attachment.height) {
      width = img.width;
      height = img.height;
    } else if (!attachment.width && attachment.height) {
      width = (img.width / img.height) * attachment.height;
    } else if (attachment.width && !attachment.height) {
      height = (img.height / img.width) * attachment.width;
    }

    if (maxSize && width && height && (maxSize < width || maxSize < height)) {
      if (width > height) {
        width = maxSize;
        height = (height / width) * maxSize;
      } else if (width < height) {
        width = (width / height) * maxSize;
        height = maxSize;
      } else {
        width = maxSize;
        height = maxSize;
      }
    }
    el.style.maxHeight = `${height}px`;
    el.style.maxWidth = `${width}px`;
  };
  img.src = attachment.url;
});
