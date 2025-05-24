package com.example.jee.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.jee.beans.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}