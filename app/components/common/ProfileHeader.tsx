import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { User } from '@/app/models/types';
import { useRouter } from 'expo-router';

interface ProfileHeaderProps {
  user: User | null;
  isCurrentUser?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  onEditProfile?: () => void;
  onLogout?: () => void;
  followersCount?: number;
  followingCount?: number;
}

const { width } = Dimensions.get('window');

export function ProfileHeader({ 
  user, 
  isCurrentUser = false, 
  isFollowing = false,
  onFollow,
  onMessage,
  onEditProfile,
  onLogout,
  followersCount,
  followingCount
}: ProfileHeaderProps) {
  const router = useRouter();
  
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
      {isCurrentUser && user && (
        <View style={styles.welcomeContainer}>
          <ThemedText style={styles.welcomeText}>
            Привет, {user.displayName?.split(' ')[0] || 'пользователь'}!
          </ThemedText>
        </View>
      )}
      
      <View style={styles.coverContainer}>
        {user && (
          <Image 
            source={{ uri: user.coverImage || 'https://via.placeholder.com/600x200' }} 
            style={styles.coverImage} 
          />
        )}
        
        {!isCurrentUser && (
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      
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
            <ThemedText style={styles.statCount}>
              {followersCount !== undefined ? followersCount : user.followers}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Подписчики</ThemedText>
          </View>
          <View style={styles.stat}>
            <ThemedText style={styles.statCount}>
              {followingCount !== undefined ? followingCount : user.following}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Подписки</ThemedText>
          </View>
        </View>
        
        {/* Стили искусства */}
        {user.artStyles && user.artStyles.length > 0 && (
          <View style={styles.tagsSection}>
            <ThemedText style={styles.tagsTitle}>Стили искусства</ThemedText>
            <View style={styles.tagContainer}>
              {user.artStyles.map((style, index) => (
                <View key={index} style={styles.tag}>
                  <ThemedText style={styles.tagText}>{style}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Категории фотографий */}
        {user.photoCategories && user.photoCategories.length > 0 && (
          <View style={styles.tagsSection}>
            <ThemedText style={styles.tagsTitle}>Категории фотографий</ThemedText>
            <View style={styles.tagContainer}>
              {user.photoCategories.map((category, index) => (
                <View key={index} style={[styles.tag, styles.photoTag]}>
                  <ThemedText style={styles.tagText}>{category}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {isCurrentUser ? (
          <View style={styles.currentUserActions}>
            <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
              <ThemedText style={styles.editButtonText}>Редактировать профиль</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <FontAwesome name="sign-out" size={16} color="#e74c3c" />
              <ThemedText style={styles.logoutText}>Выйти</ThemedText>
            </TouchableOpacity>
          </View>
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
  welcomeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  coverContainer: {
    position: 'relative',
    width: '100%',
  },
  coverImage: {
    width: width,
    height: 160,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
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
    fontSize: 14,
    color: '#888',
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 20,
    marginTop: 12,
  },
  editButtonText: {
    color: '#0a7ea4',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  followButton: {
    backgroundColor: '#0a7ea4',
  },
  unfollowButton: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
    backgroundColor: 'transparent',
  },
  followText: {
    color: '#fff',
    fontWeight: '500',
  },
  unfollowText: {
    color: '#0a7ea4',
    fontWeight: '500',
  },
  messageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialLinks: {
    flexDirection: 'row',
    marginTop: 20,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  tagsSection: {
    width: '100%',
    marginTop: 12,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  photoTag: {
    backgroundColor: '#e6f7ff',
  },
  tagText: {
    fontSize: 12,
    color: '#555',
  },
  currentUserActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 20,
    marginLeft: 10,
  },
  logoutText: {
    color: '#e74c3c',
    fontWeight: '500',
    marginLeft: 8,
  },
}); 