<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="page-head">
    <h1>About</h1>
    <p>What Hassaku Blogs is, and where the name came from.</p>
  </div>

  <div class="about-body">
    <h2>What this is</h2>
    <p>
      Hassaku Blogs is a small publishing space for the community. Anyone can
      read every post, and anyone who registers can write one. Posts carry a
      title, a body, an author and a date, which are all kept in one place.
    </p>

    <h2>The name</h2>
    <p>
      <strong>Hassaku</strong> (八朔) is a citrus fruit, traditionally eaten
      starting on the first day of the eighth lunar month. It is known for its 
      crisp, firm flesh and refreshing balance of tartness, subtle sweetness, 
      and a pleasant, mild bitterness.
    </p>
    <p>
      We took it as a metaphor for what we want this site to be: thoughtful,
      mature editorial writing. Something with a little bitterness in it, the
      kind that comes from paying attention. And, second, a form of
      seasonal or time capsule journaling, an entry kept now to be read
      later, the way a fruit kept for its season is better for the wait.
    </p>

    <p class="about-back p-2">
      <RouterLink to="/posts" class="back-link">&larr; All posts</RouterLink>
    </p>
  </div>
</template>