<template>
  <li
    class="accordion__item"
    :class="container_class"
    :style="container_styles"
  >
    <div
      class="accordion__trigger"
      :class="(visible ? 'accordion__trigger_active open' : '') + ' ' + trigger_class"
      @click="open"
      :style="trigger_styles"
      role="button"
      :aria-expanded="visible"
    >
      <div class="accordion__title">
        <slot name="accordion-trigger"></slot>
      </div>

      <!-- Right side: plus / minus icon -->
      <div class="accordion__icon " aria-hidden="true">
        <span v-if="!visible" class="icon-plus font-bold">+</span>
        <span v-else class="icon-minus font-bold">-</span>
      </div>
    </div>

    <transition
      name="accordion"
      @enter="start"
      @after-enter="end"
      @before-leave="start"
      @after-leave="end"
    >
      <div
        class="accordion__content"
        :class="content_class"
        :style="content_styles"
        v-show="visible"
      >
        <ul>
          <!-- This slot will handle all the content that is passed to the accordion -->
          <slot name="accordion-content"></slot>
        </ul>
      </div>
    </transition>
  </li>
</template>


<script>
export default {
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },

    active: {
      default: false,
      type: Boolean,
    },

    container_class: {
      type: String,
    },

    trigger_class: {
      type: String,
    },

    content_class: {
      type: String,
    },

    container_styles: {
      type: String,
    },

    trigger_styles: {
      type: String,
    },

    content_styles: {
      type: String,
    },
  },

  inject: ["allowMultiple", "Items"],

  data() {
    return {
      item: {
        active: false,
        rotate: false,
        id: this.generateRandomNumber(),
      },
    };
  },

  computed: {
    visible() {
      return this.item.active;
    },
  },
  methods: {
    generateRandomNumber() {
      let count = 0;
      return count++;
    },

    async activateFirstItem(){
      if(this.active){
        this.item.active = true
        this.item.rotate = true
      }
      return true;
    },

    open() {
      if (this.disabled) {
        return;
      }

      if(this.allowMultiple){

        if(this.item.active === false){
          this.item.rotate = false;
          this.item.active = false;
          Object.assign({}, ...this.Items, this.item)
        }else {
          this.item.rotate = false;
          this.item.active = false;
          Object.assign({}, ...this.Items, this.item)
        }

      }else {

        this.Items.forEach(item => {
          item.active = false
          item.rotate = false
        });

        this.item.active = true;
        this.item.rotate = true;
        Object.assign({}, ...this.Items, this.item)
      }
    },
    start(el) {
      el.style.height = el.scrollHeight + "px";
    },
    end(el) {
      el.style.height = "";
    },
  },
  created() {
    this.activateFirstItem().then(() => {
      this.Items.push(this.item);
    })
  },
};
</script>

<style>
.accordion__item {
  cursor: pointer;
  position: relative;
  margin-bottom: 0.75rem; /* space between items */
}

.accordion__trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid #e6e6e6;
  border-radius: 0;
  background: #ffffff;
  transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
  /* ensure bottom border shows by default so content appears separate when closed */
  border-bottom: 1px solid #e6e6e6;
}

/* Open state uses Tailwind primary color */
.accordion__trigger.open,
.accordion__trigger.accordion__trigger_active {
  border-color: #b78d46;
  box-shadow: 0 6px 18px rgba(22,40,52,0.06);
  /* remove bottom border so it visually joins with the content box */
  border-bottom-color: transparent;
}

.accordion__title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: #162834;
}


.accordion__icon {
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  line-height: 1;
  color: #162834; /* Tailwind primary */
}

.icon-plus, .icon-minus {
  display: inline-block;
  transform-origin: center;
  transition: transform 150ms ease, opacity 150ms ease;
}

.accordion__trigger.open .icon-plus { transform: scale(0.8); opacity: 0; }
.accordion__trigger.open .icon-minus { transform: scale(1); opacity: 1; }
.accordion__trigger .icon-minus { opacity: 0; transform: scale(0.8); }

/* Content styling to match trigger */
.accordion__content {
  margin-top: 0; /* sit directly under the trigger so borders can join */
  border: 1px solid #b78d46;
  background: white;
  border-radius: 0;
  overflow: hidden;
  padding: 1.2rem 1rem 0.7rem;
  /* make the top border visually connect to the trigger when open */
  border-top: transparent;
  box-shadow: 0 6px 18px rgba(22,40,52,0.06);
}

.accordion__content ul {
  padding: 0.75rem 1rem;
  margin: 0;
  color: #334155;
}

.accordion__content li {
  margin-bottom: 0.5rem;
}

.accordion__content ul {
  padding: 0;
  margin: 0;
}

.accordion-enter-active,
.accordion-leave-active {
  will-change: height, opacity;
  transition: height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

.accordion-enter,
.accordion-leave-to {
  height: 0 !important;
  opacity: 0;
}
</style>