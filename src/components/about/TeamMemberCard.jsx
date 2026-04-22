import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/about.css';

export const TeamMemberCard = ({ member, index = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            className="group"
        >
            <div className="luxury-card no-img-card">
                <div className="member-info-area">
                    <h3 className="member-name">{member.name}</h3>
                    <p className="member-role">{member.role}</p>
                    <p className="member-bio">{member.bio}</p>
                </div>
            </div>
        </motion.div>
    );
};
