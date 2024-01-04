import { useState } from 'react';
import styles from './board.module.css';
import { BoardItem } from './types';


export function Board({ board, onClick }: { onClick: any, board: BoardItem[], boardSize: number }) {
  const getTileStyle = (tile: BoardItem) => {
    return tile.answered ? styles.child + " " + styles.child_active : styles.child;
  }
  return (
    <div className="pt-14" style={{ maxWidth: '600px' }} >
      <h2 className="text-3xl font-semibold p-8" >The portion of the Earth composed primarily of iron and believed to be in a solid state.</h2>
      <ul className={styles.parent}>
        {board.map((item, i) => {
          return (
            <li onClick={onClick} className={getTileStyle(item)} key={i}>
              {item.question}
            </li>
          );
        })}
      </ul>
    </div>
  )
}
