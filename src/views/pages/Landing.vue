<script setup>
function smoothScroll(id) {
    document.body.click();
    document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
    });
}
</script>

<template>
    <div class="bg-surface-0 dark:bg-surface-900">
        <div id="home" class="landing-wrapper overflow-hidden">
            <div class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static">
                <a class="flex items-center" href="#">
                    <img src="/logo.png" alt="DiscoverMe Logo" class="h-12 mr-2" />
                    <span class="text-surface-900 dark:text-surface-0 font-medium text-2xl leading-normal mr-20">DiscoverMe</span>
                </a>
                <Button class="lg:!hidden" text severity="secondary" rounded
                    v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }">
                    <i class="pi pi-bars !text-2xl"></i>
                </Button>
                <div
                    class="items-center bg-surface-0 dark:bg-surface-900 grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
                    <ul
                        class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer gap-8">
                        <li>
                            <a @click="smoothScroll('#hero')"
                                class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                                <span>Home</span>
                            </a>
                        </li>
                        <li>
                            <a @click="smoothScroll('#about')"
                                class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                                <span>About</span>
                            </a>
                        </li>
                        <li>
                            <a @click="smoothScroll('#features')"
                                class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                                <span>Features</span>
                            </a>
                        </li>

                    </ul>
                    <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2">
                        <Button label="Login" text as="router-link" to="/auth/login" rounded></Button>
                        <Button label="Register" text as="router-link" to="/auth/signup" rounded></Button>
                    </div>
                </div>
            </div>

            <div id="hero" class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden"
                style="background: linear-gradient(0deg, rgba(148, 0, 211, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(148, 0, 211) 0%, rgb(135, 206, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%)">
                <div class="mx-6 md:mx-20 mt-0 md:mt-6">
                    <h1 class="text-6xl font-bold text-gray-900 leading-tight"><span
                            class="font-light block">Welcome</span>Discover a better you!</h1>
                    <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-700">Start your mental health
                        journey with DiscoverMe</p>
                    <Button label="Get Started" as="router-link" to="/auth/signup" rounded class="!text-xl mt-8 !px-4"></Button>
                </div>
                <div class="flex justify-center md:justify-end">
                    <img src=/DiscoverMe-Image.jpg alt="Hero Image" class="w-9/12 md:w-auto"
                        style="max-width: 20%;" />
                </div>
            </div>

            <div id="about" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
                <div class="text-center">
                    <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">About</div>
                    <span class="text-muted-color text-2xl">What is DiscoverMe?</span>
                </div>
                <div class="flex justify-center items-center mt-6">
                    <img src="@/assets/layout/about.jpg" alt="about image" class="max-w-full h-auto" style="max-width: 40%; height: auto;" />
                </div>
            </div>

            <div class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
                <div
                    class="col-span-12 lg:col-span-6 my-auto flex flex-col lg:items-end text-center lg:text-right gap-4">
                    <div class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-normal text-center">
                        DiscoverMe is a web-based Mood & Mental Health Tracker designed to help society log their moods,
                        track emotional trends, and receive personalized recommendations for mental well-being.
                    </div>
                </div>
            </div>

            <div id="features" class="py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20">
                <div class="grid grid-cols-12 gap-4 justify-center">
                    <div class="col-span-12 text-center mt-20 mb-6">
                        <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Features</div>
                        <span class="text-muted-color text-2xl">DisoverMe comes with a variety of features </span>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))">
                            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-yellow-200 mb-4"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-book !text-2xl text-yellow-700"></i>
                                </div>
                                <h5 class="mb-2 text-surface-900 dark:text-surface-0">Journaling</h5>
                                <span class="text-surface-600 dark:text-surface-200">A safe space for all of your
                                    thoughts.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))">
                            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-cyan-200 mb-4"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-heart !text-2xl text-cyan-700"></i>
                                </div>
                                <h5 class="mb-2 text-surface-900 dark:text-surface-0">Mood Settings</h5>
                                <span class="text-surface-600 dark:text-surface-200">Record how you are feeling.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pb-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(246, 158, 188, 0.2))">
                            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-indigo-200"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-check-circle !text-2xl text-indigo-700"></i>
                                </div>
                                <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Goal
                                    Setting</div>
                                <span class="text-surface-600 dark:text-surface-200">Set goals to achieve.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="footer" class="py-6 px-6 mx-0 mt-20 lg:mx-20">
                <div class="grid grid-cols-12 gap-4 items-center">
                    <div class="col-span-12 md:col-span-2 flex items-center justify-center md:justify-start">
                        <a @click="smoothScroll('#home')"
                            class="flex flex-wrap items-center justify-center md:justify-start md:mb-0 mb-4 cursor-pointer">
                            <img src="/logo.png" alt="DiscoverMe Logo" style="max-width: 50px;" />
                            <h4 class="font-medium text-3xl text-surface-900 dark:text-surface-0">DiscoverMe</h4>
                        </a>
                    </div>
                    <div class="col-span-12 md:col-span-10 flex items-center">
                        <p class="leading-relaxed">
                            DiscoverMe is a tool designed to help users track their mental health and gain insights into
                            their emotional well-being. It is not intended to diagnose, treat, or prevent any mental
                            health conditions. If you or someone you know is in immediate danger or requires urgent
                            help, please contact a healthcare professional, your local emergency services, or a mental
                            health hotline in your area. For the U.S., call or text 988 for the Suicide & Crisis
                            Lifeline.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
