import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Send,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  InputBase,
  Tooltip,
} from "@mui/material";
import CommentsPopup from "components/CommentsPopup";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const [openPopup, setOpenPopup] = useState(false);
  const [comment, setComment] = useState("");

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatePost = await response.json();
    dispatch(setPost({ post: updatePost }));
  };

  const saveComment = async () => { 
    
    if(comment. trim() == "") return;
   
    const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId, comment:  comment}),
    });
    const updatePost = await response.json();
    dispatch(setPost({ post: updatePost }));  
    setComment("");  
  };
  return (
    <Box className="boxShadow">
      <WidgetWrapper m="2rem 0" >
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
        {picturePath && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`http://localhost:3001/assets/${picturePath}`}
          />
        )}
        <FlexBetween mt="0.25rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>

            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setOpenPopup(true)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>

          <IconButton>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>

        <FlexBetween mt="0.25rem">
          <InputBase
            placeholder="Add comment.."
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            sx={{
              width: "100%",
              color: palette.primary.dark,
              padding: "1rem 0rem",
            }}
          />

          <IconButton onClick={saveComment}>
            <Tooltip title="Post Comment">
              <Send />
            </Tooltip>
          </IconButton>
        </FlexBetween>
      </WidgetWrapper>
      <CommentsPopup
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        postId={postId}
        postUserId={postUserId}
        name={name}
        description={description}
        location={location}
        picturePath={picturePath}
        userPicturePath={userPicturePath}
        likes={likes}
        comments={comments}
      ></CommentsPopup>
    </Box>
  );
};

export default PostWidget;
