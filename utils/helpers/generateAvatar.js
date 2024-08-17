const generateAvatars = () => {
    const avatarLinks = [];
    for (let i = 1; i <= 70; i++) {
      avatarLinks.push(`https://i.pravatar.cc/40?img=${i}`);
    }
    return avatarLinks;
  };
  
  export const avatars = generateAvatars();
  