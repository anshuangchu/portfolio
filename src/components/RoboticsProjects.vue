<template>
  <section id="robotics" class="section">
    <h2 class="section-title">机器人与智能车竞赛</h2>
    <p class="section-desc">将算法落地到物理世界，在轮腿穿越与自主导航中挑战工程极限</p>
    <div class="grid">
      <ProjectCard
        icon="🦿"
        title="自适应轮腿双极增稳机器人"
        description="设计并实现轮腿复合式移动平台，采用串级PID+五连杆解算的双极增稳控制算法。通过腿部折叠→加速→起跳→空中姿态控制→着陆缓冲的全流程控制，适应崎岖地形下的自主穿越与动态平衡。"
        :tags="['轮腿机器人', '增稳控制', '五连杆', '跳跃控制']"
      />
      <ProjectCard
        icon="🗺️"
        title="GPS+惯导融合自主导航"
        description="基于 GPS+IMU 组合导航的室外自主穿越方案。采用扩展卡尔曼滤波融合 GPS 位置与惯导姿态数据，结合 TOF 激光测距实现锥桶绕桩、雷区探测、颠簸路段等复杂科目的全自主路径规划。"
        :tags="['GPS导航', 'EKF融合', 'TOF测距', '自主规划']"
      />
      <ProjectCard
        icon="🏎️"
        title="智能车硬件系统设计"
        description="全国大学生智能汽车竞赛轮腿穿越组硬件方案。从主控选型(英飞凌 CYT4BB7)、电源树设计(CN3903+ME6211)、FOC无刷驱动(FD6288T+NMOS三相桥)到舵机信号光耦隔离，全栈硬件系统集成。"
        :tags="['硬件设计', 'PCB', 'CYT4BB7', 'FOC驱动']"
      />
      <ProjectCard
        icon="⚙️"
        title="FOC 无刷电机驱动系统"
        description="基于英飞凌 CYT2BL3 的磁场定向控制(FOC)无刷电机驱动。采用 FD6288T 栅极驱动+6路 NMOS 三相全桥架构，4.7Ω 栅极电阻抑制开关振铃，支持电流采样闭环控制，适配第21届竞赛自制模块要求。"
        :tags="['FOC', '无刷电机', 'CYT2BL3', '三相全桥']"
      />
      <ProjectCard
        icon="🎯"
        title="串级PID 平衡控制系统"
        description="双环串级 PID 架构实现轮腿机器人动态平衡：外环角度环 → 内环角速度环。独创腿部控速方案——速度环输出给舵机关节，通过改变重心的方式实现加减速，相较传统倾角控速响应更快、稳定性更强。"
        :tags="['串级PID', '平衡控制', '四元数解算', '卡尔曼滤波']"
      />
      <ProjectCard
        icon="🛠️"
        title="变形轮腿机构设计"
        description="借鉴山东师范大学原创方案，探索 3D 打印变形轮腿机构的自主设计。仅限定舵机/电机型号，车体结构完全自定义。通过四杆机构+弹性变形轮实现平地高速与越障能力的动态切换。"
        :tags="['机械设计', '3D打印', '变形轮', '自由度优化']"
      />
    </div>
  </section>
</template>

<script setup>
import ProjectCard from './ProjectCard.vue'
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
</style>
