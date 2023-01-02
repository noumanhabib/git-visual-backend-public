const allRoles = {
  user: [
    'getUsers',
    'manageUsers',
    'managePosts',
    'getPosts',
    'getJobs',
    'manageJobs',
    'getConversations',
    'sendMessages',
    'getMessages',
    'readMessages',
    'initConversation',
    'likeJobs',
    'viewJobs',
    'likePosts',
    'viewPosts',
    'searchJobs',
    'pay',
    'subscribe',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
