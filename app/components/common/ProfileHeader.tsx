import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { User } from '@/app/models/types';

interface ProfileHeaderProps {
  user: User | null;
  isCurrentUser?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  onEditProfile?: () => void;
}

const { width } = Dimensions.get('window');

export function ProfileHeader({ 
  user, 
  isCurrentUser = false, 
  isFollowing = false,
  onFollow,
  onMessage,
  onEditProfile
}: ProfileHeaderProps) {
  // Если пользователь не загружен, показываем заглушку
  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.placeholderCover} />
        <View style={styles.profileInfo}>
          <ThemedText style={styles.loadingText}>Загрузка профиля...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Image 
        source={{ uri: user.coverImage || 'https://via.placeholder.com/600x200' }} 
        style={styles.coverImage} 
      />
      
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        {user.isVerified && (
          <View style={styles.verifiedBadge}>
            <FontAwesome name="check" size={12} color="#fff" />
          </View>
        )}
      </View>
      
      <View style={styles.profileInfo}>
        <ThemedText style={styles.displayName}>{user.displayName}</ThemedText>
        <ThemedText style={styles.username}>@{user.username}</ThemedText>
        
        {user.location && (
          <View style={styles.infoRow}>
            <FontAwesome name="map-marker" size={14} color="#888" />
            <ThemedText style={styles.infoText}>{user.location}</ThemedText>
          </View>
        )}
        
        {user.websiteUrl && (
          <View style={styles.infoRow}>
            <FontAwesome name="link" size={14} color="#888" />
            <ThemedText style={[styles.infoText, styles.link]}>{user.websiteUrl}</ThemedText>
          </View>
        )}
        
        <ThemedText style={styles.bio}>{user.bio}</ThemedText>
        
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <ThemedText style={styles.statCount}>{user.followers}</ThemedText>
            <ThemedText style={styles.statLabel}>Подписчики</ThemedText>
          </View>
          <View style={styles.stat}>
            <ThemedText style={styles.statCount}>{user.following}</ThemedText>
            <ThemedText style={styles.statLabel}>Подписки</ThemedText>
          </View>
        </View>
        
        <View style={styles.tagContainer}>
          {user.artStyles.map((style, index) => (
            <View key={index} style={styles.tag}>
              <ThemedText style={styles.tagText}>{style}</ThemedText>
            </View>
          ))}
        </View>
        
        {isCurrentUser ? (
          <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
            <ThemedText style={styles.editButtonText}>Редактировать профиль</ThemedText>
          </TouchableOpacity>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, isFollowing ? styles.unfollowButton : styles.followButton]} 
              onPress={onFollow}
            >
              <ThemedText style={isFollowing ? styles.unfollowText : styles.followText}>
                {isFollowing ? 'Отписаться' : 'Подписаться'}
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.messageButton} onPress={onMessage}>
              <FontAwesome name="envelope" size={18} color="#888" />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.socialLinks}>
          {user.socialLinks.instagram && (
            <TouchableOpacity style={styles.socialIcon}>
              <FontAwesome name="instagram" size={20} color="#C13584" />
            </TouchableOpacity>
          )}
          {user.socialLinks.twitter && (
            <TouchableOpacity style={styles.socialIcon}>
              <FontAwesome name="twitter" size={20} color="#1DA1F2" />
            </TouchableOpacity>
          )}
          {user.socialLinks.behance && (
            <TouchableOpacity style={styles.socialIcon}>
              <FontAwesome name="behance" size={20} color="#053eff" />
            </TouchableOpacity>
          )}
          {user.socialLinks.artstation && (
            <TouchableOpacity style={styles.socialIcon}>
              <FontAwesome name="paint-brush" size={20} color="#13AFF0" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ThemedView>
  );
}

export default ProfileHeader;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  coverImage: {
    width: width,
    height: 160,
    resizeMode: 'cover',
  },
  placeholderCover: {
    width: width,
    height: 160,
    backgroundColor: '#e0e0e0',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    color: '#888',
  },
  avatarContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginTop: -50,
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    backgroundColor: '#1DA1F2',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    padding: 16,
    alignItems: 'center',
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  username: {
    fontSize: 16,
    color: '#888',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 6,
  },
  link: {
    color: '#0a7ea4',
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  statCount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#0a7ea4',
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  followButton: {
    backgroundColor: '#0a7ea4',
  },
  unfollowButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  followText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  unfollowText: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
}); 