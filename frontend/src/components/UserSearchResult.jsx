import UserPaper from "./UserPaper.jsx";

export default function UserSearchResult({ loading, searchedUsers }) {
  return loading
    ? Array.from({ length: 10 }).map((_, i) => <UserPaper key={i} />)
    : searchedUsers instanceof Array
    ? searchedUsers?.length
      ? searchedUsers.map((user, i) => {
          return (
            <UserPaper
              username={user.username}
              profile_pic={user.profile_pic}
              _id={user._id}
              status={user.status}
              key={i}
            />
          );
        })
      : "No user found"
    : null;
}
