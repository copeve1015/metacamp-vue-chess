<template>
  <BNavbar toggleable="lg" variant="success" v-b-color-mode="'dark'">
    <BNavbarBrand to="/">Chess</BNavbarBrand>
    <BNavbarToggle target="nav-collapse" />
    <BCollapse id="nav-collapse" is-nav>
      <BNavbarNav>
        <BNavItem to="/game">Game</BNavItem>
        <BNavItem href="#">Log</BNavItem>
      </BNavbarNav>
    </BCollapse>
  </BNavbar>
</template>
