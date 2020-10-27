import { useState, useCallback, useEffect, useRef } from 'preact/hooks';
import { createElement } from 'preact';
import { useApiClient, useApi } from '../../lib/use-api';
import { normalizeImage } from '../../lib/normalize-image';
import ArticlesList from '../arcticles';

export default function ProfilePage({ username }) {
  const me = username === '';

  const realProfile = useApi(
    api => (username === '' ? api.getMyProfile() : api.getProfile(username)),
    [username]
  );

  const api = useApiClient();

  const [overrides, overrideProfile] = useState({});
  const profile = Object.assign({}, realProfile, overrides);

  const profileRef = useRef(profile);
  profileRef.current = profile;

  useEffect(() => {
    overrideProfile({});
  }, [realProfile]);

  const follow = useCallback(async () => {
    const { username } = profileRef.current;
    overrideProfile(profile => {
      return { ...profile, following: true };
    });
    try {
      await api.followProfile(username);
    } catch (e) {
      if (profileRef.current.username !== username) return;
      overrideProfile(profile => {
        profile = Object.assign({}, profile);
        delete profile.following;
        return profile;
      });
    }
  }, [api, profileRef]);

  const unfollow = useCallback(async () => {
    const { username } = profileRef.current;
    overrideProfile(profile => {
      return { ...profile, following: false };
    });
    try {
      await api.unfollowProfile(username);
    } catch (e) {
      if (profileRef.current.username !== username) return;
      overrideProfile(profile => {
        profile = Object.assign({}, profile);
        delete profile.following;
        return profile;
      });
    }
  }, [api, profileRef]);

  return (
    <div class="profile-page">
      <div class="user-info">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-md-10 offset-md-1">
              <img src={normalizeImage(profile.image)} class="user-img" />
              <h4>{profile.username || username}</h4>
              <p>{profile.bio}</p>
              {profile.following ? (
                <button
                  class="btn btn-sm btn-outline-secondary action-btn"
                  onClick={unfollow}
                >
                  <i class="ion-person-remove-round" />
                  Following {profile.username}
                </button>
              ) : (
                <button
                  class="btn btn-sm btn-outline-secondary action-btn"
                  onClick={follow}
                >
                  <i class="ion-plus-round" />
                  Follow {profile.username}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <div class="articles-toggle">
              <ul class="nav nav-pills outline-active">
                <li class="nav-item">
                  <a class="nav-link active" href="">
                    {me ? 'My ' : ''}Articles
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="">
                    Favorited Articles
                  </a>
                </li>
              </ul>
            </div>

            <ArticlesList author={username} />
          </div>
        </div>
      </div>
    </div>
  );
}
