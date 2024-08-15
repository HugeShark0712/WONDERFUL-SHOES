<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from './Button.vue'; // Import the Button component

const props = defineProps({
    circles: {
        type: Array,
        required: true
    },
    activeMenu: {
        type: String,
        default: null
    }
});

const emits = defineEmits(['toggleMenu']);

const router = useRouter();
const showPopup = ref(false);
const isConfirmation = ref(false); // To distinguish between different confirmation dialogs

const toggleMenu = (circleId) => {
    emits('toggleMenu', circleId);
};

const goBackToHomepage = () => {
    isConfirmation.value = true; // Set confirmation flag for back to homepage
    showPopup.value = true; // Show the popup
};

const confirmCancel = () => {
    showPopup.value = false; // Hide the popup
    router.push({ name: 'Home' }); // Navigate to the homepage
};

const cancelCancel = () => {
    showPopup.value = false; // Hide the popup
    isConfirmation.value = false; // Reset confirmation flag
};

const confirmConfiguration = () => {
    isConfirmation.value = false; // Reset confirmation flag for configuration
    showPopup.value = true; // Show the popup
};

// Handle confirmation and redirect to basket
const handleConfirmConfiguration = () => {
    emits('saveConfiguration'); // Emit event to save configuration
    showPopup.value = false; // Hide the popup
    router.push({ name: 'Basket' }); // Navigate to the basket
};

// Map IDs to display names
const getDisplayName = (id) => {
    const names = {
        'laces': 'Laces',
        'inside': 'Inner Lining',
        'outside_1': 'Upper Exterior',
        'sole_1': 'Midsole',
        'sole_2': 'Outsole',
        'jewelry': 'Jewelry',
        'options': 'Options'
    };
    return names[id] || id;
};
</script>

<template>
    <div class="left-menu">
        <!-- "Back to Homepage" button -->
        <Button type="back-home" @click="goBackToHomepage">
            Back to Homepage
        </Button>

        <!-- Existing shoe options -->
        <div class="shoe-options">
            <div v-for="circle in circles" :key="circle.id" class="circle" @click="toggleMenu(circle.id)"
                :class="{ active: circle.id === activeMenu }">
                {{ getDisplayName(circle.id) }}
            </div>
        </div>

        <!-- "Confirm Configuration" button -->
        <Button type="confirm-config" @click="confirmConfiguration">
            Confirm Configuration
        </Button>

        <!-- Confirmation Popup -->
        <transition name="popup">
            <div v-if="showPopup" class="popup-overlay">
                <div class="popup-content">
                    <h3 v-if="!isConfirmation">Do you really want to confirm the configuration and go to the basket?
                    </h3>
                    <h3 v-else>Do you really want to cancel the configuration and go back to the homepage?</h3>
                    <div class="popup-buttons">
                        <!-- Configuration confirmation buttons -->
                        <Button type="confirm" v-if="!isConfirmation" @click="handleConfirmConfiguration">Yes</Button>
                        <Button type="remove" v-if="!isConfirmation" @click="cancelCancel">No</Button>

                        <!-- Back to homepage confirmation buttons -->
                        <Button type="confirm" v-if="isConfirmation" @click="confirmCancel">Yes</Button>
                        <Button type="remove" v-if="isConfirmation" @click="cancelCancel">No</Button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.left-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100px;
    height: 100%;
    background-color: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    z-index: 3;
    color: #fff;
}

.shoe-options {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
}

.circle {
    width: 35px;
    height: 35px;
    margin: 8px 0;
    background-color: #fff;
    color: #000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
    font-size: 0.65rem;
}

.circle:hover {
    background-color: #555;
    color: #fff;
}

.active {
    background-color: #69FF47;
    color: #fff;
}

/* Popup styles */
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;
}

.popup-content {
    background-color: #000000;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 250px;
    text-align: center;
}

.popup-buttons {
    margin-top: 10px;
}

.popup-buttons Button {
    margin: 5px;
}

.popup-content h3 {
    margin-bottom: 10px;
}
</style>