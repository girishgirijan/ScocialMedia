import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  SendOutlined,
  Close,
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
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import WidgetWrapper from "./WidgetWrapper";
import FlexBetween from "./FlexBetween";
import Friend from "./Friend";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import UserImage from "./UserImage";
import { useNavigate, Link } from "react-router-dom";
import moment from "moment";

function CommentsPopup({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  openPopup,
  setOpenPopup,
}) {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const { _id } = useSelector((state) => state.user);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const medium = palette.neutral.medium;

  const [comment, setComment] = useState("");
  const navigate = useNavigate();

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
    if (comment.trim() == "") return;

    const response = await fetch(
      `http://localhost:3001/posts/${postId}/comment`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, comment: comment }),
      }
    );
    const updatePost = await response.json();
    dispatch(setPost({ post: updatePost }));
    setComment("");
  };
  return (
    <>
      <Dialog
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        aria-describedby={`dialog-description-${postId}`}
        maxWidth="lg"
      >
        <DialogContent style={{ padding: "0px", margin: "0px" }}>
          <DialogContentText id={`dialog-description-${postId}`}>
            <Box className="commentBox">
              <Box className="commentBoxL">
                <Box className="img_area">
                  {picturePath && (
                    <img
                      alt="post"
                      src={`http://localhost:3001/assets/${picturePath}`}
                      style={{ marginBottom: "-6px", maxHeight: "100%" }}
                      width="100%"
                      className="commentImg"
                    />
                  )}
                </Box>
              </Box>
              <Box className="commentBoxR">
                <Box className="commentBoxR1">
                  <Box className="header-text">
                    <Friend
                      friendId={postUserId}
                      name={name}
                      subtitle={location}
                      userPicturePath={userPicturePath}
                    />
                  </Box>
                  <IconButton onClick={() => setOpenPopup(false)}>
                    <Close />
                  </IconButton>
                </Box>
                <Divider />
                <Box className="commentBoxR2">
                  <Box mt="0.5rem">
                    {comments.map((comment, i) => (
                      <Box key={`${name}-${i}`}>
                        <Box sx={{ display: "flex" }}>
                          <UserImage image={comment.picturePath} size="30px" />
                          <Typography color={main} fontSize=".85rem" sx={{marginLeft: "10px"}}>
                            {comment.name}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{ m: "0.5rem 0", color: "#000", paddingLeft: "40px" }}
                        >
                          {comment.text}
                        </Typography>
                        <Typography
                          sx={{ m: "0.5rem 0", color: main, paddingLeft: "40px", fontSize: ".65rem" }}
                        >
                          {moment(comment.created).fromNow()}
                        </Typography>
                        
                       
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Divider />
                <Box className="commentBoxR3">
                  <InputBase
                    placeholder="Add comment.."
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                    sx={{
                      width: "100%",
                      color: palette.primary.dark,
                      flex: 1,
                    }}
                  />
                  <IconButton onClick={saveComment}>
                    <Tooltip title="Post Comment">
                      <Send />
                    </Tooltip>
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CommentsPopup;
